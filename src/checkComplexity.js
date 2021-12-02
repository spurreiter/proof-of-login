import { assert } from './utils.js'

/**
 * verifies the needed complexity of leading zero bits of digest
 * @param {number} complexity
 * @param {Uint8Array} digest
 * @returns {boolean} `true` if digest matches complexity
 */
export function checkComplexity (complexity, digest) {
  assert(complexity < digest.byteLength * 8, 'Complexity is too high')
  let offset = 0
  let i
  for (i = 0; i <= complexity - 8; i += 8, offset++) {
    if (digest[offset] !== 0) {
      return false
    }
  }
  const mask = 0xff << (8 + i - complexity)
  return (digest[offset] & mask) === 0
}
