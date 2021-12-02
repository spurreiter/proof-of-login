export const ALGO_MAP = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

/**
 * @param {Uint8Array} buffer
 * @returns {string}
 */
export const toBase64 = (buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)))

/**
 * @param {string} string
 * @return {Uint8Array}
 */
export const fromBase64 = string => Uint8Array.from(atob(string), c => c.charCodeAt(0))

/**
 * @param {any} val
 * @param {string} [msg]
 */
export function assert (val, msg) {
  if (!val) throw new Error(msg || 'Assertion failed')
}
