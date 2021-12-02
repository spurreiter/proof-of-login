import { webcrypto as crypto } from 'crypto'
import { ALGO_MAP, assert, toBase64 } from './utils.js'
import { writeTimestamp, writeInBuffer } from './buffer.js'
import { readChallenge } from './readChallenge.js'

/** @typedef {import('./readChallenge.js').ChallengeObj} ChallengeObj */

const SECRET = Symbol('SECRET')
const KEY = Symbol('KEY')

const getRandomBytes = (length = 32) => {
  const buffer = new Uint8Array(length)
  // @ts-ignore
  crypto.getRandomValues(buffer)
  return buffer
}

/**
 * @param {string} secret
 * @returns {CryptoKey}
 */
// @ts-ignore
const importKey = (secret) => crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(secret),
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify']
)

export class Challenge {
  /**
   * @param {string} secret
   */
  constructor (secret) {
    this[SECRET] = secret
    // @ts-ignore
    importKey(this[SECRET]).then(key => {
      this[KEY] = key
    })
  }

  /**
   * creates a challenge
   * ```
   * |          1 |    1 |         8 |     22 |     20-64 | // Bytes
   * | complexity | algo | timestamp | random | signature | // Description
   * ```
   * @param {number} complexity
   * @param {string} algo
   * @returns {Promise<string>}
   */
  async create (complexity, algo = 'SHA-256') {
    if (!this[KEY]) {
      this[KEY] = await importKey(this[SECRET])
    }

    complexity = Number(complexity)
    const algoNum = ALGO_MAP.indexOf(algo)

    assert(!isNaN(complexity), 'Complexity is not a number')
    assert(complexity < 255, 'Complexity must be less than 255')
    assert(algoNum !== undefined, `Unsupported hash algorithm ${algo}`)

    let offset = 0
    const buffer = new Uint8Array(32)
    buffer[offset++] = complexity & 0xFF
    buffer[offset++] = algoNum
    offset = writeTimestamp(buffer, offset, Date.now())
    offset = writeInBuffer(buffer, offset, getRandomBytes(22))

    // @ts-ignore
    const signature = await crypto.subtle.sign('HMAC', this[KEY], buffer)
    const out = new Uint8Array([...buffer, ...new Uint8Array(signature)])
    return toBase64(out)
  }

  /**
   * verifies the challenge
   * @throws
   * @param {string} challenge
   * @returns {Promise<ChallengeObj>}
   */
  async verify (challenge) {
    if (!this[KEY]) {
      this[KEY] = await importKey(this[SECRET])
    }
    const { complexity, algo, timestamp, payload, signature, buffer } = readChallenge(challenge)
    // @ts-ignore
    const isValid = await crypto.subtle.verify('HMAC', this[KEY], signature, payload)
    if (isValid) return { complexity, algo, timestamp, payload, signature, buffer }
    throw new Error('Invalid Challenge')
  }
}
