export default {
  input: 'lib/index.js',
  output: {
    file: 'lib/index.cjs', format: 'cjs', sourcemap: true, exports: 'default'
  },
  external: ['loader-utils', 'path', 'fs', 'libdenolint']
}
