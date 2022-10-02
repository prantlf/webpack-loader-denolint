const denolint = require('webpack-loader-denolint')
const { strictEqual } = require('assert')
const test = require('tehanu')(__filename)

test('exports all methods', () => {
  strictEqual(typeof denolint, 'function')
})
