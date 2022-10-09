import { urlToRequest } from 'loader-utils'
import { relative, sep } from 'path'
import { readFileSync } from 'fs'
import { lint } from 'libdenolint'

const cwd = process.cwd()

function normalizePath(path) {
  path = relative(cwd, path)
  /* c8 ignore next */
  if (sep !== '/') path = path.split(sep).join('/')
  return path
}

export default function denolint(content, map, meta) {
  const {
    configFile = '.denolint.json', ignoreConfig, rules,
    format, formatter, throwOnWarning = true, throwOnError = true
  } = this.getOptions({
    type: 'object',
    title: 'debolint options',
    properties: {
      configFile: { type: 'string' },
      ignoreConfig: { type: 'boolean' },
      rules: {
        type: 'object',
        properties: {
          all: { type: 'boolean' },
          include: {
            type: 'array',
            items: { type: 'string' }
          },
          exclude: {
            type: 'array',
            items: { type: 'string' }
          }
        }    
      },
      formatter: { instanceof: 'Function' },
      throwOnWarning: { type: 'boolean' },
      throwOnError: { type: 'boolean' }
    }
  })

  let allRules, excludeRules, includeRules
  if (rules) {
    ({ all: allRules, exclude: excludeRules, include: includeRules } = rules)
  } else if (!ignoreConfig) {
    try {
      const config = JSON.parse(readFileSync(configFile, 'utf8'))
      const { tags = [], rules = {} } = config
      if (allRules === undefined) allRules = !tags.includes('recommended')
      ({ exclude: excludeRules, include: includeRules } = rules)
      // eslint-disable-next-line no-empty
    } catch {}
  }

  const fullPath = urlToRequest(this.resourcePath)
  const path = normalizePath(fullPath)
  const callback = this.async()
  lint(path, content, {
    allRules, excludeRules, includeRules, format
  })
    .then(warnings => {
      if (formatter) warnings = formatter(warnings, fullPath, content)
      for (const warning of warnings) console.warn(warning)
      const err = warnings.length && throwOnWarning ? new Error('Warnings were found') : null
      callback(err, content, map, meta)
    })
    .catch(error => {{
      let { message } = error
      if (format === 'compact') {
        const loc = message.indexOf(` at ${path}`)
        if (loc > 0) {
          message = `${message.substring(loc + 4)}: ${message.substring(0, loc)}`
        /* c8 ignore next 3 */
        } else {
          message = `${path}: ${message}`
        }
      } else {
        /* c8 ignore next */
        const suffix = message.includes(path) ? '' : ` at ${path}`
        message = `${message}${suffix}\n`
      }
      let messages = [message]
      if (formatter) messages = formatter(messages, fullPath, content)
      for (const message of messages) console.error(message)
      const err = throwOnError ? new Error('Errors were found') : null
      callback(err, content, map, meta)
    }})
}
