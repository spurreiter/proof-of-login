
/**
 * write uint32 value from buffer
 * @param {Uint8Array} buffer
 * @param {number} value uint32 number
 * @param {number} offset
 * @returns {number} new offset
 */
export function writeUInt32 (buffer, offset, value) {
  buffer[offset] = (value >>> 24) & 0xff
  buffer[offset + 1] = (value >>> 16) & 0xff
  buffer[offset + 2] = (value >>> 8) & 0xff
  buffer[offset + 3] = value & 0xff
  return offset + 4
}

/**
 * read uint32 value from buffer
 * @param {Uint8Array} buffer
 * @param {number} offset
 * @returns {number} uint32 value
 */
export function readUInt32 (buffer, offset) {
  return ((buffer[offset] << 24) |
    (buffer[offset + 1] << 16) |
    (buffer[offset + 2] << 8) |
    buffer[offset + 3]) >>> 0
}

/**
 * write unix timestamp
 * @param {Uint8Array} buffer
 * @param {number} timestamp unix timestamp
 * @param {number} offset
 * @returns {number} new offset
 */
export function writeTimestamp (buffer, offset, timestamp) {
  const hi = (timestamp / 0x100000000) >>> 0
  const lo = (timestamp & 0xffffffff) >>> 0

  offset = writeUInt32(buffer, offset, hi)
  return writeUInt32(buffer, offset, lo)
}

/**
 * read unix timestamp
 * @param {Uint8Array} buffer
 * @param {number} offset
 * @returns {number} timestamp unix timestamp
 */
export function readTimestamp (buffer, offset) {
  return readUInt32(buffer, offset) * 0x100000000 + readUInt32(buffer, offset + 4)
}

/**
 * write `data` into `buffer` at offset
 * @param {Uint8Array} buffer
 * @param {number} offset
 * @param {Uint8Array} data
 * @returns {number} new offset
 */
export function writeInBuffer (buffer, offset, data) {
  data.forEach((value, i) => {
    buffer[offset + i] = value
  })
  return offset + data.length
}
