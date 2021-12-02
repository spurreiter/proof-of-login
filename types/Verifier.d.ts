export class Verifier {
    /**
     * @param {Challenge} challenger
     * @param {object} param1
     * @param {number} [param1.maxAge=300] maxAge in seconds
     */
    constructor(challenger: Challenge, { maxAge }?: {
        maxAge?: number;
    });
    challenger: import("./Challenge").Challenge;
    maxAgeMs: number;
    /**
     * verify signed challenge with provided nonce if required complexity on PoW matches
     * @param {string} challenge
     * @param {string} nonce
     * @returns {Promise<boolean>}
     */
    verify(challenge: string, nonce: string): Promise<boolean>;
}
export type Challenge = import('./Challenge').Challenge;
