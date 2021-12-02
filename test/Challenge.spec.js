import assert from 'assert'
import { Challenge } from '../src/index.js'

describe('Challenge', function () {
  let ch
  let challenge
  before(function () {
    ch = new Challenge('kitchen-sink')
  })

  it('shall create challenge with complexity 5', async function () {
    challenge = await ch.create(5)
    console.log(challenge)
  })

  it('shall verify challenge', async function () {
    const valid = await ch.verify(challenge)
    assert.ok(valid)
  })
})
