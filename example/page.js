
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

export const loginPage = ({ challenge = '', action = '/login', error = '', username = '' }) => {
  const body = `
  <style>
  .login label, .login input { display: block; margin-bottom: 0.3em; }
  .login input { padding: 0.5em; }
  .login button { margin: 0.3em 0; padding: 0.5em; }
  .login .error { padding: 0.5em; background-color: #ffddee; color: #ff1133; }
  </style>
  <form class="login" method="post" action="${action}">
    <fieldset>
      <legend>Login</legend>

      ${error ? `<div class="error">${error.replace(/\n/g, '<br>')}</div>` : ''}

      <label for="username">username</label>
      <input id="username" name="username" type="text" value="${username}" placeholder="alice" required>

      <label for="password">password</label>
      <input id="password" name="password" type="password" required>

      <input id="challenge" name="challenge" type="hidden" value="${challenge}">
      <input id="nonce" name="nonce" type="hidden" value="">

      <button id="submit" type="submit">Sign in</button>

      <div id="wait"></div>
      </fieldset>
  </form>
  <script type="module">
  import { solve } from '/js/browser.js'

  const did = (id) => document.getElementById(id)

  async function calcNonce() {
    const $submit = did('submit')
    $submit.disabled = true
    const $wait = did('wait')
    $wait.innerText = 'calculating nonce...'
    const time = Date.now()
    did('nonce').value = await solve(did('challenge').value)
    $wait.innerText = \`calculating nonce took \${Date.now() - time} ms\`
    $submit.disabled = false
  }

  calcNonce()
  </script>
  `

  return page({ title: 'Login', body })
}
