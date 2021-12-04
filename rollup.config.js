// @ts-nocheck
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

const banner = ''

export default [
  {
    input: 'src/browser.js',
    plugins: [babel({ babelHelpers: 'bundled' })],
    output: [
      {
        file: 'dist/browser.js',
        format: 'esm',
        banner
      },
      {
        file: 'dist/browser.min.js',
        format: 'esm',
        plugins: [terser()],
        banner
      },
      {
        file: 'dist/browser.cjs',
        format: 'cjs',
        banner
      },
      {
        file: 'dist/browser.min.cjs',
        format: 'cjs',
        plugins: [terser()],
        banner
      }
    ]
  },
  {
    input: 'src/index.js',
    plugins: [babel({ babelHelpers: 'bundled' })],
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
        banner
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        banner
      }
    ]
  }
]
