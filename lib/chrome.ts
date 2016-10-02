import { Browser } from './browser'
import * as path from 'path'
import deepAssign from './helpers/deep-assign'

const proxy_auth_crx = `Q3IyNAIAAAAmAQAAAAEAADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL/TVqwVCLnTANE0vDS+kuFMSBRWH4ZUTzBrUqgEapv9bDHO5QhNov4u4KaM74S++tbMHetybWDMwtdTzJwZOaUWPrkZw16W4f6rueLHDrgGLeqSZ9s24lxwwyD2ldbeEQ33KTyPnmGOCv76tYcO7WXYQGhPnFCzvCk6+LzbfAk+zwTFyJhm1WwEAk1Suj4d5IfGuKxzHBfYZD7bFYu3bC1QAhhtvv6GO3njM/UXq7zRWs5+OQmjH921JS9MnJOBAJ3Ee1O0fQgG2b4QaARvoJClYqBxKNuMuBNOO3T/bc8f/XCZGVdnAerEYrufD+bGOiXyl4KZjqufDg5A9rV1DB0CAwEAAbp7yb06CEiHHhOabk91eL/lzqpbss3Vjod73Q6toV1LCbCHH66h0HT9KLU40NX3JvWw09JCbKN7JScC8CSOuL3omwQdHDB5BJNwIFhI9a6PYMiSSfcq81NqNSEO9FUgbRgV7buxIIw6S1y8X5Hsdmmy/h7nTtaUA/jtBpJ997kQYntKCuRpMY0XUV8+olg1oMpe2GpJ895s0OgKcPd8JMp/MG4lzvKLYc2QxQIpwMoQF9V/xsizOj+SFrIvXQBEGl0mBpwdN2+dwFWLYxhkDwgVsUslKSAVu/fBNRijIBLofHmaoOWCQKaeJO8FuyocIMENZIN37Ume5kLz6ABxqDtQSwMEFAAACAgAYblCSQWF5cKiAAAA+AAAAA0AAABtYW5pZmVzdC5qc29uXY5BDoIwFETX7SmavyZEXRpjogcwxK0hpECtldJiS1FDuLt8YEFczpvJzPSUEqi5UXfh26wTzitrgO3ZLhoNw2uBAhJnP192Cu0DkJfCF0417ZL9t1c1sI03E8t5UUlngykR95QQmDs86hvkMn56SCkZMN0IVyuPJbON8bfIL7xTkk+zEVvYVbzC+B1H1vqsbVEpI2d+4FpnwWl/BEpSOtAfUEsDBBQAAAgIAE8JQ0mdpyXVIwEAABUCAAAFAAAAYmcuanNlUUFOwzAQPDevWOVQJ1LkB0SkEnBFCHHhUFXITTbNCtcu9pqCqv4dm5KSljl5d8cznrVGBm03ZKCCnfJ+b12XZe3g7BblHteP6oM2iskaac0d9tbhbwul6roH8owGXdEhK9IemgUcshn1Y0MGp6Vn5di/EA+F6BSruhJlmXiz5Y/3n/UKGpjedLjTqsXztQqEKKXfaeJC1KKMEq013mqUUam4UovjY3Ysp3me8T2g5xjmNvCQKnLYXUTpg2lT4DFCeilEUA/nVOSfnP38gqZpgF1AmM9PaxzJCQ45ODNpJKhoex8t0TAp7eurcYIIHp1RWxT1SbT6TxkjRsr526aEY3Z5inuo4ABxp9Fymd8orV9TschXECfLfK1t+0Zmk6/K7BtQSwECAAAUAAAICABhuUJJBYXlwqIAAAD4AAAADQAAAAAAAAABAAAAAAAAAAAAbWFuaWZlc3QuanNvblBLAQIAABQAAAgIAE8JQ0mdpyXVIwEAABUCAAAFAAAAAAAAAAEAAAAAAM0AAABiZy5qc1BLBQYAAAAAAgACAG4AAAATAgAAAAA=`

const defaultOptions = {
  desiredCapabilities: {
    chromeOptions: {
      args: [
        '--new-window',
        '--disable-background-networking',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-default-apps',
        '--disable-translate',
        '--disable-sync',
        '--disable-web-resources',
        '--disable-translate-new-ux',
        '--disable-session-crashed-bubble',
        '--disable-password-manager-reauthentication',
        '--disable-save-password-bubble',
        '--disable-plugins-discovery',
        '--disable-plugins',
        //'--disable-gpu',
        '--safe-plugins',
        '--safebrowsing-disable-auto-update',
        '--safebrowsing-disable-download-protection',
        '--ignore-certificate-errors',
        '--metrics-recording-only',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-managed-user-acknowledgment-check',
        '--no-network-profile-warning',
        '--no-pings',
        '--noerrdialogs',
        '--password-store=basic',
      ]
    }
  }
}

export class Chrome extends Browser {
  constructor(options) {
    super(options)
    this.options = updateOptions(this.options)
  }
  async start(options?) {
    let opt = updateOptions(Object.assign({}, this.options, options))
    let sesssions = await this.webdriver.getSessions()
    for (let v of sesssions.value) {
      if (v.capabilities.chrome.userDataDir.toLowerCase() == (opt.dir + (opt.user ? require('path').sep + opt.user : '')).toLowerCase()) {
        await this.webdriver.quit({ sessionId: v.id })
      }
    }
    if (opt.proxy) {
      let auth = opt.proxy.split('@')
      if (auth.length == 2) {
        opt.proxy = auth[1]
        if (!Array.isArray(opt.desiredCapabilities.chromeOptions.extensions)) opt.desiredCapabilities.chromeOptions.extensions = []
        opt.desiredCapabilities.chromeOptions.extensions.push(proxy_auth_crx)
        let url = opt.url
        opt.url = 'data:,' + auth[0]
        let res = await super.start(opt)
        await this.url(url || 'chrome://newtab')
        return res
      }
    }
    return super.start(opt)
  }
  userDataDir() {
    return this.capabilities.chrome.userDataDir
  }
  args(opt: string, value?: string | boolean): any {
    const args: Array<string> = this.options.desiredCapabilities.chromeOptions.args
    const i = args.findIndex(v => v.split('=')[0] == opt)
    if (value === undefined) {
      if (i >= 0) {
        let v = args[i].split('=')
        if (v.length > 1) {
          return v[1]
        }
        return true
      }
      else {
        return false
      }
    }
    if (typeof value === 'boolean') {
      if (i >= 0) {
        if (!value) args.splice(i, 1)
      }
      else {
        if (value) args.push(opt)
      }
    }
    else {
      const val = opt + '=' + value
      if (i >= 0) {
        args[i] = val
      }
      else {
        args.push(val)
      }
    }
  }
}

function updateOptions(options: any) {
  if (!options.desiredCapabilities.chromeOptions) options.desiredCapabilities.chromeOptions = {}
  if (!Array.isArray(options.desiredCapabilities.chromeOptions.args)) options.desiredCapabilities.chromeOptions.args = []
  const args: Array<string> = options.desiredCapabilities.chromeOptions.args
  let i = 0
  for (let arg of args) {
    if (arg.startsWith('--')) {
      args[i++] = arg.substr(2)
    }
  }
  let userDir
  if (options.dir) {
    userDir = path.join(options.dir, options.user ? options.user + '' : '0')
    setOpt(args, 'user-data-dir', userDir)
  }
  if (typeof options.fullscreen === 'boolean') {
    setOpt(args, 'start-fullscreen', options.fullscreen)
  }
  if (options.useragent) {
    setOpt(args, 'user-agent', options.useragent)
  }
  if (typeof options.disableFlash === 'boolean') {
    setOpt(args, 'disable-bundled-ppapi-flash', options.disableFlash)
  }
  if (options.prefs && userDir) {
    const fs = require('fs')
    const preferences = userDir + '/Default/Preferences'
    try {
      const prefs = fs.readFileSync(preferences, 'utf8')
      let data = JSON.parse(prefs)
      data = deepAssign(data, options.prefs)
      fs.writeFileSync(preferences, JSON.stringify(data), 'utf8')
    }
    catch (e) {
    }
  }
  return options
}

function setOpt(args: string[], opt: string, value: string | boolean) {
  const i = args.findIndex(v => v.split('=')[0] == opt)
  if (typeof value === 'boolean') {
    if (i >= 0) {
      if (!value) args.splice(i, 1)
    }
    else {
      if (value) args.push(opt)
    }
  }
  else {
    const val = opt + '=' + value
    if (i >= 0) args[i] = val
    else args.push(val)
  }
}
