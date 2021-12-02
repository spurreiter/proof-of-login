/**
 * verifies the needed complexity of leading zero bits of digest
 * @param {number} complexity
 * @param {Uint8Array} digest
 * @returns {boolean} `true` if digest matches complexity
 */
export function checkComplexity(complexity: number, digest: Uint8Array): boolean;
