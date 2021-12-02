import { writeTimestamp, writeUInt32 } from './buffer.js'
import { readChallenge } from './readChallenge.js'
import { checkComplexity } from './checkComplexity.js'
import { assert, toBase64 } from './utils.js'

// for node.js
// eslint-disable-next-line no-use-before-define
if (typeof crypto === 'undefined') {
  // @ts-ignore
  // eslint-disable-next-line no-var
  var crypto
  // @ts-ignore
  if (typeof window === 'undefined') {
    import('crypto').then(({ webcrypto }) => {
      crypto = webcrypto
    })
  } else {
    crypto = window.crypto
  }
}

const random = () => (Math.random() * 0x100000000) >>> 0

/**
 * @param {number} [ms]
 * @returns {Promise<void>}
 */
const timeout = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms))

function getNonce () {
  let offset = 0
  const buffer = new Uint8Array(24)
  offset = writeTimestamp(buffer, offset, Date.now())
  while (offset < 24) {
    offset = writeUInt32(buffer, offset, random())
  }
  return buffer
}

/**
 * @param {string} challenge base64 encoded challenge
 */
export async function solve (challenge) {
  let { complexity, algo, buffer } = readChallenge(challenge)
  complexity = Number(complexity)
  assert(!isNaN(complexity), 'Complexity must be a number')

  while (true) { // may take a long time
    const nonce = getNonce()
    const bufferConcat = new Uint8Array([...buffer, ...nonce])
    // @ts-ignore
    const digest = await crypto.subtle.digest(algo, bufferConcat)
    if (checkComplexity(complexity, new Uint8Array(digest))) return toBase64(nonce)
    await timeout() // allow eventloop to kick-in
  }
}
