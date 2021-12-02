import { webcrypto as crypto } from 'crypto'
import { readTimestamp } from './buffer.js'
import { checkComplexity } from './checkComplexity.js'
import { fromBase64 } from './utils.js'

/** @typedef {import('./Challenge').Challenge} Challenge */

const FIVE_MINUTES = 5 * 60

export class Verifier {
  /**
   * @param {Challenge} challenger
   * @param {object} param1
   * @param {number} [param1.maxAge=300] maxAge in seconds
   */
  constructor (challenger, { maxAge = FIVE_MINUTES } = {}) {
    this.challenger = challenger
    this.maxAgeMs = maxAge * 1000
  }

  /**
   * verify signed challenge with provided nonce if required complexity on PoW matches
   * @param {string} challenge
   * @param {string} nonce
   * @returns {Promise<boolean>}
   */
  async verify (challenge, nonce) {
    const { complexity, algo, timestamp, buffer } = await this.challenger.verify(challenge)

    const nonceBuffer = fromBase64(nonce)
    const nonceTimestamp = readTimestamp(nonceBuffer, 0)

    if (nonceTimestamp < timestamp || nonceTimestamp > timestamp + this.maxAgeMs) {
      return false
    }

    const bufferConcat = new Uint8Array([...buffer, ...nonceBuffer])
    // @ts-ignore
    const digest = await crypto.subtle.digest(algo, bufferConcat)
    return checkComplexity(complexity, new Uint8Array(digest))
  }
}
