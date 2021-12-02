// @ts-nocheck
import babel from '@rollup/plugin-babel'

const banner = ''

export default [
  {
    input: 'src/browser.js',
    plugins: [babel({ babelHelpers: 'bundled' })],
    output: [
      {
        file: 'dist/browser.js',
        format: 'esm',
        name: 'solve',
        banner
      }
    ]
  }
]
