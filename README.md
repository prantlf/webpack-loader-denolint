# webpack-loader-denolint

[![Latest version](https://img.shields.io/npm/v/webpack-loader-denolint)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/webpack-loader-denolint)
](https://www.npmjs.com/package/webpack-loader-denolint)
[![Coverage](https://codecov.io/gh/prantlf/webpack-loader-denolint/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/webpack-loader-denolint)

A [Webpack] loader to lint entry points and all imported files with [denolint].

A lot faster than [eslint-loader], handling both JavaScript and TypeScript sources. Use [rollup-plugin-denolint] for [Rollup]. Or simpler, just the [command-line `denolint`].

## Synopsis

```js
module.exports = {
  // the rest of the configuration
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'webpack-loader-denolint'
      },
      // other loaders
    ]
  }
}
```

## Installation

Make sure that you use [Node.js] 14 or newer and [Webpack] 5 or newer. Use your favourite package manager - [NPM], [PNPM] or [Yarn]:

```sh
npm i -D webpack-loader-denolint
pnpm i -D webpack-loader-denolint
yarn add -D webpack-loader-denolint
```

## Usage

Create a `webpack.config.js` [configuration file] and enable the loader:

```js
module.exports = {
  // the rest of the configuration
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: ['tests'],
        loader: 'webpack-loader-denolint',
        options: {
          rules: {
            exclude: ['no-unused-vars']
          }
        }
      },
      // other loaders
    ]
  }
}
```

Then call `webpack` either via the [command-line] or [programmatically].

## Options

The following options can be passed in an object to the plugin function to change the default values.

### `configFile`

Type: `string`<br>
Default: `'.denolint.json'`

Config file to load the tag, rule inclusion and exclusion lists from. File inclusion and exclusion lists are ignored. Use `include` and `exclude` options of this plugin.

### `ignoreConfig`

Type: `boolean`<br>
Default: `false`

Do not look for `.denolint.json` by default.

### `rules`

Type: `object`<br>
Default: `undefined`

Rules to include or exclude. If specified, the config file will be ignored. See [Rules](#rules) below.

### `throwOnWarning`

Type: `boolean`<br>
Default: `true`

Throw an error and abort if any warnings were reported.

### `throwOnError`

Type: `boolean`<br>
Default: `true`

Throw an error and abort if source file parsing failed fatally.

### `formatter`

Type: `boolean`<br>
Default: `true`

Custom warning and error formatter:

    (messages: string[], path: string, content: string) => string[]

## Rules

The following properties are recognised in the rules object.

### `all`

Type: `boolean`<br>
Default: `false`

Use all rules if set to `true`, otherwise only the recommended ones.

### `include`

Type: `string[]`<br>
Default: `[]`

List of rules to include extra, if only recommended rules are enabled.

### `exclude`

Type: `string[]`<br>
Default: `[]`

List of rules to exclude from all or recommended ones.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code.

## License

Copyright (C) 2022 Ferdinand Prantl

Licensed under the [MIT License].

[MIT License]: http://en.wikipedia.org/wiki/MIT_License
[Webpack]: https://webpack.js.org/
[denolint]: https://github.com/prantlf/denolint/tree/master/packages/libdenolint#readme
[eslint-loader]: https://github.com/webpack-contrib/eslint-loader#readme
[rollup-plugin-denolint]: https://github.com/prantlf/rollup-plugin-denolint#readme
[Rollup]: https://rollupjs.org/
[command-line `denolint`]: https://github.com/prantlf/denolint/tree/master/packages/denolint#readme
[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[configuration file]: https://webpack.js.org/configuration/
[command-line]: https://webpack.js.org/api/cli
[programmatically]: https://webpack.js.org/api/node
