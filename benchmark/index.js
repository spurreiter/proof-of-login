import { Challenge, Verifier, solve } from '../src/index.js'
import { hrtime } from 'process'

const challenger = new Challenge('SECRET')
const verifier = new Verifier(challenger, { maxAge: 60 * 60, maxSkew: 60 * 60 })

const round = (v, places = 3) => Number(v.toFixed(places))

async function run (complexity) {
  const challenge = await challenger.create(complexity)
  const start = hrtime.bigint()
  const nonce = await solve(challenge, true)
  const diff = Number(hrtime.bigint() - start) / 1e6
  const isValid = await verifier.verify(challenge, nonce)
  if (!isValid) {
    console.log('Error', challenge, nonce)
  }
  return round(diff)
}

const CYCLE_RUNS = 10

function calcAvg (times) {
  return times.reduce((o, time) => {
    o.add += time
    o.count += 1
    o.min = Math.min(time, o.min)
    o.max = Math.max(time, o.max)
    o.avg = round(o.add / o.count)
    return o
  }, { min: Infinity, max: 0, add: 0, count: 0 })
}

async function cycle (complexity) {
  const times = []
  for (let i = 0; i < CYCLE_RUNS; i++) {
    const diff = await run(complexity)
    times.push(diff)
  }
  const { min, max, avg } = calcAvg(times)

  console.log([complexity, avg, min, max].join('\t'))
}

async function suite () {
  for (let complexity = 0; complexity < 22; complexity++) {
    await cycle(complexity)
  }
}

suite().catch(console.error)
