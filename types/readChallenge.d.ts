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
export function readChallenge(string: string): ChallengeObj;
export type ChallengeObj = {
    complexity: number;
    algo: string;
    /**
     * unix timestamp
     */
    timestamp: number;
    payload: Uint8Array;
    signature: Uint8Array;
    /**
     * challenge as Uint8Array buffer
     */
    buffer: Uint8Array;
};
