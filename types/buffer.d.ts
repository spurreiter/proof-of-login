/**
 * write uint32 value from buffer
 * @param {Uint8Array} buffer
 * @param {number} value uint32 number
 * @param {number} offset
 * @returns {number} new offset
 */
export function writeUInt32(buffer: Uint8Array, offset: number, value: number): number;
/**
 * read uint32 value from buffer
 * @param {Uint8Array} buffer
 * @param {number} offset
 * @returns {number} uint32 value
 */
export function readUInt32(buffer: Uint8Array, offset: number): number;
/**
 * write unix timestamp
 * @param {Uint8Array} buffer
 * @param {number} timestamp unix timestamp
 * @param {number} offset
 * @returns {number} new offset
 */
export function writeTimestamp(buffer: Uint8Array, offset: number, timestamp: number): number;
/**
 * read unix timestamp
 * @param {Uint8Array} buffer
 * @param {number} offset
 * @returns {number} timestamp unix timestamp
 */
export function readTimestamp(buffer: Uint8Array, offset: number): number;
/**
 * write `data` into `buffer` at offset
 * @param {Uint8Array} buffer
 * @param {number} offset
 * @param {Uint8Array} data
 * @returns {number} new offset
 */
export function writeInBuffer(buffer: Uint8Array, offset: number, data: Uint8Array): number;
