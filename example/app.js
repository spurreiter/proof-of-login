import { fileURLToPath } from 'node:url'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import timingSafeEqual from 'compare-timing-safe'

import { Challenge, Verifier } from '../src/index.js'
import { expressify } from './expressify.js'
import { homePage, loginPage } from './page.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '')

const INITIAL_COMPLEXITY = 8

const challengeStore = new Map()
const userBadLoginStore = new Map()
const userStore = new Map([['alice', 'alice']])

const challenger = new Challenge('this-is-secret')
const verifier = new Verifier(challenger)

const app = express()

app.use(cookieParser())

app.get('/favicon.ico', (req, res) => res.end())

app.use('/js',
  // eslint-disable-next-line node/no-path-concat
  express.static(`${__dirname}/../dist`)
)

app.get('/',
  (req, res) => {
    res.type('html').end(homePage({ title: 'Home' }))
  }
)

app.get('/login', expressify(
  async (req, res) => {
    const complexity = INITIAL_COMPLEXITY
    const challenge = await challenger.create(complexity)
    challengeStore.set(challenge, complexity)

    res.type('html').end(loginPage({ challenge }))
  }
))

app.post('/login', expressify(
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const { challenge, nonce, username, password } = req.body

    try {
      if (!challengeStore.has(challenge)) {
        throw new Error('Login failed! (No challenge in store)')
      }
      if (!await verifier.verify(challenge, nonce)) {
        throw new Error('Login failed! (Bad nonce)')
      }
      if (!timingSafeEqual(userStore.get(username) || '', password || '')) {
        throw new Error('Login failed! (Bad password)')
      }
      challengeStore.delete(challenge)
      userBadLoginStore.delete(username)
      res.redirect('/')
      return
    } catch (e) {
      console.error(e)

      const badlogins = userBadLoginStore.get(username) || 1
      userBadLoginStore.set(username, badlogins + 1)

      const complexity = Math.min(22, INITIAL_COMPLEXITY + badlogins)

      const error = e.message + `\n${badlogins}x bad login attempts.\nComplexity is ${complexity}`

      const nextChallenge = await challenger.create(complexity)
      challengeStore.set(nextChallenge, complexity)

      res.type('html').end(loginPage({ challenge: nextChallenge, error, username }))
    }
  }
))

app.listen(3030)
