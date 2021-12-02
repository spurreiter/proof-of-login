import assert from 'assert'
import { Verifier, Challenge, solve } from '../src/index.js'

describe('Verifier', function () {
  this.timeout(10000)

  it('shall solve the challenge and verify it', async function () {
    const challenger = new Challenge('nyan-cat')
    const verifier = new Verifier(challenger)

    const challenge = await challenger.create(1)
    const nonce = await solve(challenge)

    console.log(challenge, nonce)
    const isValid = await verifier.verify(challenge, nonce)

    assert.ok(isValid)
  })
})
