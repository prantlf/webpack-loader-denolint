import { createFsFromVolume, Volume } from 'memfs'
import webpack from 'webpack'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { ok, rejects, strictEqual } from 'assert'
import tehanu from 'tehanu'

const __dirname = dirname(fileURLToPath(import.meta.url))
const test = tehanu(import.meta.url)

function configure(test, options, text) {
  const use = [
    {
      loader: join(__dirname, '../lib/index.cjs'),
      options
    }
  ]
  if (text) use.unshift(join(__dirname, 'loaders/text.cjs'))
  return {
    entry: join(__dirname, `samples/${test}/ultimate.${text ? 'txt' : 'js'}`),
    output: {
      filename: 'test.js',
      path: join(__dirname, 'output'),
      module: true,
      library: { type: 'module' }
    },
    mode: 'none',
    experiments: {
      outputModule: true,
    },
    module: {
      rules: [
        {
          test: text ? /\.txt$/ : /\.js$/,
          use
        }
      ]
    }
  }
}

function build(options) {
  return new Promise((resolve, reject) => {
    const fs = createFsFromVolume(new Volume())
    const compiler = webpack(options)
    compiler.outputFileSystem = fs
    compiler.run((err, stats) => {
      compiler.close(err2 => {
        if (err) reject(err)
        else if (err2) reject(err2)
        else if (stats.hasErrors()) {
          const { errors } = stats.toJson()
          console.log(errors)
          reject(errors[0])
        } else {
          resolve(fs)
        }
      })
    })
  })
}

test('pass', async () => {
  await build(configure('pass', { configFile: 'test/.denolint.json' }))
})

test('warn', async () => {
  await rejects(build(configure('warn', { ignoreConfig: true })))
})

test('warn silently', async () => {
  await build(configure('warn', { ignoreConfig: true, throwOnWarning: false }))
})

test('fail', async () => {
  await rejects(build(configure('fail', { ignoreConfig: true }, true)))
})

test('fail silently', async () => {
  await build(configure('fail', { ignoreConfig: true, throwOnError: false }, true))
})

test('missing config', async () => {
  await build(configure('pass', { configFile: 'missing' }))
})

test('explicit rules', async () => {
  await build(configure('warn', {
    ignoreConfig: true, rules: { exclude: ['no-unused-vars', 'no-var']}
  }))
})

test('formatter of warnings', async () => {
  let params
  await rejects(build(configure('warn', {
    ignoreConfig: true,
    formatter: (warnings, path, content) => {
      params = { warnings, path, content }
      return warnings
    }
  })))
  strictEqual(params.warnings.length, 2)
  ok(params.path.endsWith('test/samples/warn/ultimate.js'))
  strictEqual(typeof params.content, 'string')
})

test('formatter of errors', async () => {
  let params
  await rejects(build(configure('fail', {
    ignoreConfig: true,
    formatter: (errors, path, content) => {
      params = { errors, path, content }
      return errors
    }
  }, true)))
  strictEqual(params.errors.length, 1)
  ok(params.path.endsWith('test/samples/fail/ultimate.txt'))
  strictEqual(typeof params.content, 'string')
})
