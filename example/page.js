
export const page = ({ title = '', body = '' }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body, input, button { font-family: Arial, Helvetica, sans-serif; }
    input, button { font-size: 1em; }
  </style>
</head>
<body>
  ${body}
</body>
</html>
`

export const homePage = ({ title = '' }) => {
  const body = `
  <h1>Home</h1>
  <nav>
    <a href="/login">login</a>
  </nav>
  `
  return page({ title, body })
}

export const userPage = ({ username = '' }) => {
  const title = `Hi ${username}!`
  const body = `
  <h1>${title}</h1>
  <nav>
    <a href="/logout">logout</a>
  </nav>
  `
  return page({ title, body })
}

export const loginPage = ({
  challenge = '',
  action = '/login',
  error = '',
  username = '',
  simplechallenge = ''
}) => {
  const body = `
  <style>
  label, input { display: block; margin-bottom: 0.3em; }
  input { padding: 0.5em; }
  button { margin: 0.3em 0; padding: 0.5em; }
  .error { padding: 0.5em; background-color: #ffddee; color: #ff1133; }
  </style>
  <form id="loginForm" method="post" action="${action}">
    <fieldset>
      <legend>Login</legend>

      ${error ? `<div class="error">${error.replace(/\n/g, '<br>')}</div>` : ''}

      <label for="username">username</label>
      <input id="username" name="username" type="text" value="${username}" placeholder="alice">

      <label for="password">password</label>
      <input id="password" name="password" type="password">

      <label for="challenge">challenge</label>
      <input id="challenge" name="challenge" type="text" value="${challenge}">
      <input id="nonce" name="nonce" type="hidden" value="">

      <button id="signin" type="submit">Sign in</button>

      <div id="wait"></div>
    </fieldset>
  </form>
  <script type="module">
  import { solve } from '/js/browser.js'

  const timeout = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))
  const did = (id) => document.getElementById(id)
  const $form = did('loginForm')
  const $button = did('signin')

  async function calcNonce() {
    $button.disabled = true
    const $wait = did('wait')
    $wait.innerText = 'calculating nonce...'
    const time = Date.now()
    did('nonce').value = await solve(did('challenge').value)
    $wait.innerText = \`calculating nonce took \${Date.now() - time} ms\`
    await timeout(300)
    $button.disabled = false
  }

  let doSubmit = false
  $form.addEventListener('submit', (ev) => {
    if (doSubmit) return true
    ev.preventDefault()
    doSubmit = true
    calcNonce().then(async () => {
      $form.submit()
      $button.disabled = true
    })
    return false
  })

  </script>
  `

  return page({ title: 'Login', body })
}
