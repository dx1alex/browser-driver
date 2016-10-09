import { Browser } from './browser'
import * as path from 'path'
import deepAssign from './helpers/deep-assign'

const proxy_ext = 'Q3IyNAIAAAAmAQAAAAEAADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAN4DrlCG2Oaj17uLRRDWYEkC1fZ/yYMrxBUtANvT9jr5+Ldvz1bj0y5hCYgLXR+zrBOqhnjaJEoWKvc8w2fxA1RRUjUnWbevjDnL4kW4OcT6AYNarTKaT9Zvc4pZvjTytc0/nVCuZDVHBvVjpWgEroz7PcUXo1RR74Y+6FWYri2DLu27IZ6xxQGB4W3h1QBViPNJYklXe7QTX3FFzF2b2m/a4iPnOU00YvFYgJ7Kn4wqQIYQ4PUtDii3m16M4tjCcN9yQ4Y5uFuFCDmfmtPKC7d2xjBL0vlPh9zSJRqb3FUpeEaXnL08kLZgzSlDv66iPuSGbRehdXNiZqJtOOR8PssCAwEAAU2aIWwCvZYuhWeNYdaMh9Nxn+7kqatCp01SsQ3sEDBQ8b6qpa0DNaNpOfW0czSdnD0mgdHjxIXwnPYwlSxSfZaRS8/BZTADbyWS6N3xMMahS8XzK//fPi0RjaUPffTcoXRURbdNrgbcgS7uNzIhGwamyHhSp9+5gjXzHbdk3A4IKuZnnmY1bDHTjPq2wJuExsZpTp+pxsrUZN1SoYBewkYP4BDqeTku72LCF9wQkq8gY7bPiv4IA+pFOtDfpxEEILlncAcMS0ZxN8PzzH+ZBOxQOshHkwKUnF8HPrcrc7gWVMvk62NgrG7Wl3bakag0hIBDoS3/lCe+cN9QVix7GhhQSwMEFAAACAgAt5JJSRO/PgqmAAAAKAEAAA0AAABtYW5pZmVzdC5qc29ubY/BDoIwDIbP7ilIz4SoR2M8+ADGcDWEDJjLZGy4AmoI724dGDCxt35f+6ftWUAFFTfqKrBJO+FQWQO7YBuOyvBKUAtnZ58vmGAhMHeqbsbRXzdHwCZaf2nG81I625qCRO+Z52MOErxAJqMbQuLlMO3VwlUKP4F+hq2o4CGyE++U5P6AcE4jEYt7S5/8p0dt81IZubT14ngP9lzrtHUaD+Bhwgb2BlBLAwQUAAAICABxmUlJULoXyvABAABOBQAABQAAAGJnLmpzlVNNj5wwDL3zK1IugXbEtFfU2X5de1j1OhqtsuAZohpCk7C71Yr/XifAkAH20BwgiZ/tZ/sFwTLR2WrHWq1e/kZRUWlVQ/YMj7/gTwfGZqr5DmelYTqLsvwpjYUGdFKCFRINO9yx14jRKlRjFEKG6pLwhSffsRGfdRrTyDsgEWiFFjU7hNZMQ4uigIRX1rb5fu/p7b9QDM5HV3lmyeh6YLxAEJqnI48Vl9E8G4c6fdjMgLWyuZjMo5LXfsZpsJ1ugqjeWTQFYM6s7uBq6KPhG5RFNXmCmWlR2oR/vaWeITQXWzn6n0LinpT3PX48DVEZoIEAcgyGdvLQZfZjpYwlhNLWA4ZCBx75xGO7C7RJ5lRPAjvIFx2oVUl38Vm+QPlgQD+BNvHuBqI7BLP0c8tQEoR7l3PL7CFFBbVL4Ka/iDstX9+mxdWcsw/ut7L30fapn0OZQrWUm2u4dEiiGTo7dmylh5UW+qjfjXYSMnXgGN9q+H18cpBj/Iiq+E3NiE/p9sP7RkN2J6mh/K93FzpuPjsnwOlWmvtBcKRDV0UoRYd757SWjpVHV5MXGeWTDalMGPOsdOmU5tCh0K6NCigu3NI56uZ7cyF/UCnQWClwU1S8IxU2ogaesyH6GjKlI8i0fUsNb03ys0B8cIe7rSH+A1BLAQIAABQAAAgIALeSSUkTvz4KpgAAACgBAAANAAAAAAAAAAEAAAAAAAAAAABtYW5pZmVzdC5qc29uUEsBAgAAFAAACAgAcZlJSVC6F8rwAQAATgUAAAUAAAAAAAAAAQAAAAAA0QAAAGJnLmpzUEsFBgAAAAACAAIAbgAAAOQCAAAAAA=='

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
      if (v.capabilities.chrome.userDataDir == (opt.dir + (opt.user ? require('path').sep + opt.user : '')).toLowerCase()) {
        await this.webdriver.quit({ sessionId: v.id })
      }
    }
    opt.desiredCapabilities.chromeOptions.extensions = [proxy_ext]
    return super.start(opt)
  }
  userDataDir() {
    return this.capabilities.chrome.userDataDir
  }
  setProxy(proxy) {
    if (!proxy) proxy = 'clear'
    return this.url('http://proxy/?' + proxy)
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
