import { readTimestamp } from './buffer.js'
import { ALGO_MAP, fromBase64 } from './utils.js'

/**
 * @typedef {object} ChallengeObj
 * @property {number} complexity
 * @property {string} algo
 * @property {number} timestamp unix timestamp
 * @property {Uint8Array} payload
 * @property {Uint8Array} signature
 * @property {Uint8Array} buffer challenge as Uint8Array buffer
 */

/**
 * read the contents of the challenge
 * @param {string} string challenge as Base64 string
 * @returns {ChallengeObj}
 */
export function readChallenge (string) {
  let offset = 0
  const buffer = fromBase64(string)
  const complexity = buffer[offset++]
  const algoNum = buffer[offset++]
  const algo = ALGO_MAP[algoNum]
  const timestamp = readTimestamp(buffer, offset)
  offset += 30
  const payload = buffer.slice(0, offset)
  const signature = buffer.slice(offset, buffer.length)

  return {
    complexity,
    algo,
    timestamp,
    payload,
    signature,
    buffer
  }
}
