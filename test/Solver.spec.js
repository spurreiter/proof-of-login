import assert from 'assert'
import { solve } from '../src/index.js'

describe('Solver', function () {
  const challenge = 'BQEAAAF9dZoafVCFn5lA0+4v09bPn5iVNYjLKBaw9/FUI9ZbEkEUwk4obm+yrsMmFAqVGSAyCTmAJM0syJCfyw=='

  it('shall solve the nonce', async function () {
    const nonce = await solve(challenge)
    console.log(nonce)
    assert.strictEqual(typeof nonce, 'string')
  })
})
