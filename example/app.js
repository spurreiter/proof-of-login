import { fileURLToPath } from 'node:url'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import timingSafeEqual from 'compare-timing-safe'

import { Challenge, Verifier } from '../src/index.js'
import { expressify } from './expressify.js'
import { homePage, userPage, loginPage } from './page.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '')

const INITIAL_COMPLEXITY = 11
const MAX_COMPLEXITY = 21 // ~120 avg secs to calculate the nonce
const SECRET = 'change me, if you can'

// prevent replay attacks - consider using redis with ttl
const challengeStore = new Map()
// increase complexity on every bad login attempt
const userBadLoginStore = new Map()
// username password store
const userStore = new Map([['alice', 'alice'], ['bob', 'bob']])

// ----

const challenger = new Challenge(SECRET)
const verifier = new Verifier(challenger)

// ---- helpers

const calcComplexity = (badlogins = 0) =>
  Math.min(MAX_COMPLEXITY, INITIAL_COMPLEXITY + badlogins)

const getNstoreChallenge = async (complexity) => {
  const challenge = await challenger.create(complexity)
  challengeStore.set(challenge, complexity)
  return challenge
}

// ----

const app = express()

app.use(cookieParser())

app.get('/favicon.ico', (req, res) => res.end())

app.use('/js',
  // eslint-disable-next-line node/no-path-concat
  express.static(`${__dirname}/../dist`)
)

app.get('/',
  (req, res) => {
    const { username } = req.cookies || {}
    const page = username
      ? userPage({ username })
      : homePage({ title: 'Home', username })
    res.type('html').end(page)
  }
)

app.get('/logout',
  (req, res) => {
    res.clearCookie('username')
    res.redirect('/')
  }
)

app.get('/login', expressify(
  async (req, res) => {
    const complexity = INITIAL_COMPLEXITY
    const challenge = await getNstoreChallenge(complexity)
    res.type('html').end(loginPage({ challenge }))
  }
))

app.post('/login', expressify(
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const { challenge, nonce, username, password } = req.body
    let badlogins = 0

    try {
      if (!challengeStore.has(challenge)) {
        throw new Error('Login failed! (Replay)')
      }
      challengeStore.delete(challenge)

      // calculate the complexity from previous bad login attempts for that user
      // prevents using another simpler challenge from GET /login
      badlogins = (userBadLoginStore.get(username) || 0)
      const expectedComplexity = calcComplexity(badlogins)

      if (!await verifier.verify(challenge, nonce, expectedComplexity)) {
        throw new Error('Login failed! (Bad nonce)')
      }
      if (!username || !password || !timingSafeEqual(userStore.get(username) || '', password || '')) {
        throw new Error('Login failed! (Bad password)')
      }
      userBadLoginStore.delete(username)
      res.cookie('username', username, { htmlOnly: true })
      res.redirect('/')
      return
    } catch (e) {
      console.error(e)

      badlogins += 1
      userBadLoginStore.set(username, badlogins)

      const complexity = calcComplexity(badlogins)
      const error = e.message + `\n${badlogins}x bad login attempts.\nComplexity is ${complexity}`

      const nextChallenge = await getNstoreChallenge(complexity)
      const simplechallenge = await getNstoreChallenge(INITIAL_COMPLEXITY)
      res.type('html').end(loginPage({ challenge: nextChallenge, error, username, simplechallenge }))
    }
  }
))

app.listen(3030)
