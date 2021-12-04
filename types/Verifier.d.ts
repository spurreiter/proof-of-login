export class Verifier {
    /**
     * @param {Challenge} challenger
     * @param {object} param1
     * @param {number} [param1.maxAge=300] maxAge in seconds
     * @param {number} [param1.maxSkew=900] maxSkew in seconds (max difference allowed between challenge and nonce timestamp)
     */
    constructor(challenger: Challenge, { maxAge, maxSkew }?: {
        maxAge?: number;
        maxSkew?: number;
    });
    challenger: import("./Challenge").Challenge;
    maxAgeMs: number;
    maxSkewMs: number;
    /**
     * verify signed challenge with provided nonce if required complexity on PoW matches
     * @throws {Error}
     * @param {string} challenge
     * @param {string} nonce
     * @param {number} [expectedComplexity] prevent replay attacks for a given challenge
     * @returns {Promise<boolean>}
     */
    verify(challenge: string, nonce: string, expectedComplexity?: number): Promise<boolean>;
}
export type Challenge = import('./Challenge').Challenge;
