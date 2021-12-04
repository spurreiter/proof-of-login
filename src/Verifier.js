import { webcrypto as crypto } from 'crypto'
import { readTimestamp } from './buffer.js'
import { checkComplexity } from './checkComplexity.js'
import { fromBase64 } from './utils.js'

/** @typedef {import('./Challenge').Challenge} Challenge */

const FIVE_MINUTES = 5 * 60
const QUARTER_HOUR = 15 * 60

export class Verifier {
  /**
   * @param {Challenge} challenger
   * @param {object} param1
   * @param {number} [param1.maxAge=300] maxAge in seconds
   * @param {number} [param1.maxSkew=900] maxSkew in seconds (max difference allowed between challenge and nonce timestamp)
   */
  constructor (challenger, { maxAge = FIVE_MINUTES, maxSkew = QUARTER_HOUR } = {}) {
    this.challenger = challenger
    this.maxAgeMs = maxAge * 1000
    this.maxSkewMs = maxSkew * 1000
  }

  /**
   * verify signed challenge with provided nonce if required complexity on PoW matches
   * @throws {Error}
   * @param {string} challenge
   * @param {string} nonce
   * @param {number} [expectedComplexity] prevent replay attacks for a given challenge
   * @returns {Promise<boolean>}
   */
  async verify (challenge, nonce, expectedComplexity) {
    const { maxAgeMs, maxSkewMs } = this
    const { complexity, algo, timestamp, buffer } = await this.challenger.verify(challenge)

    // prevents use of a "easier" challenge for attacking a user account
    if (expectedComplexity !== undefined && expectedComplexity !== complexity) {
      return false
    }

    // check challenge timestamp
    if (Date.now() > timestamp + maxAgeMs || Date.now() < timestamp - 1000) {
      return false
    }

    // check nonce timestamp
    const nonceBuffer = fromBase64(nonce)
    const nonceTimestamp = readTimestamp(nonceBuffer, 0)
    if (timestamp > nonceTimestamp + maxSkewMs || timestamp < nonceTimestamp - maxSkewMs) {
      return false
    }

    const bufferConcat = new Uint8Array([...buffer, ...nonceBuffer])
    // @ts-ignore
    const digest = await crypto.subtle.digest(algo, bufferConcat)
    return checkComplexity(complexity, new Uint8Array(digest))
  }
}
