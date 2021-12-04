/**
 * @param {string} challenge base64 encoded challenge
 * @param {boolean} [noWait=false] disable handover to event loop
 */
export function solve(challenge: string, noWait?: boolean): Promise<string>;
