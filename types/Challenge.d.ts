export class Challenge {
    /**
     * @param {string} secret
     */
    constructor(secret: string);
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
    create(complexity: number, algo?: string): Promise<string>;
    /**
     * verifies the challenge
     * @throws
     * @param {string} challenge
     * @returns {Promise<ChallengeObj>}
     */
    verify(challenge: string): Promise<ChallengeObj>;
    [SECRET]: string;
    [KEY]: any;
}
export type ChallengeObj = import('./readChallenge.js').ChallengeObj;
/** @typedef {import('./readChallenge.js').ChallengeObj} ChallengeObj */
declare const SECRET: unique symbol;
declare const KEY: unique symbol;
export {};
