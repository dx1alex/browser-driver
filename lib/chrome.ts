import { Browser } from './browser'
import * as path from 'path'
import deepAssign from './helpers/deep-assign'

const proxy_auth_crx = `Q3IyNAIAAAAmAQAAAAEAADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJo22bkc5o0i6bX5kcKSTgzqv6RL9k6zD52P922fSJ6ngMCskoFttOoSFz6zKaIY501238XxAHwGXtzLdn0JdtsGRU+Jwx4CZVzi5jEkzWhPZsCDWd5rlwRjEqJLDyXTc30I6NJHpITZueR/C1tqYQfxjHVTmStsF1jQ19l5bcIBeLKv714Wunh1+NcQEBPZ/c3BwFRq0CVWvt0k/XlQehGB4sPFVm1HgcdO44Dnf88jZVXPazxnk/tfkHK7IBiWiwNagXqgF/Yuqx+QXekEeSYQcB+CUYrxZ9LX0XjSft5j6INlwq9yuIFJssHidBeAqPHcciG/c3GvRYq3yGaiwSMCAwEAARaES/HfTucJuHwrwWiPlcgbweQSym8IZN/G0iqHUi6kyrfIo9pRVT0au9jzMhajMDRW2PaB2yhaFUikN+L7tzCKVXAsCZfbhLMX6ditzXKlTI8RvkkyvdSFOb8g+PqEBzl8S0tTzpTgHmKSwaj3FEgfGzRvB1mJQlpu8LLv/554ZQf2t8j0ghuuTSwfOYi8gXOwuc8JzmoSQlI/1Zr+2/llwZK0khkblSyxbtf5NM1jWxx+8+NtGRjXpsWbG4dF6dZMi4SOhTvdGkwfuwaEY1CcC+QXnLZRqLrd3UhlIkV6Ej5aOauhj/RKa3HUeYUAW0PuqjU/AGzoH+MGXuBqKDVQSwMEFAAACAgAYblCSQWF5cKiAAAA+AAAAA0AAABtYW5pZmVzdC5qc29uXY5BDoIwFETX7SmavyZEXRpjogcwxK0hpECtldJiS1FDuLt8YEFczpvJzPSUEqi5UXfh26wTzitrgO3ZLhoNw2uBAhJnP192Cu0DkJfCF0417ZL9t1c1sI03E8t5UUlngykR95QQmDs86hvkMn56SCkZMN0IVyuPJbON8bfIL7xTkk+zEVvYVbzC+B1H1vqsbVEpI2d+4FpnwWl/BEpSOtAfUEsDBBQAAAgIALMLQ0khGJlvQwEAAMICAAAFAAAAYmcuanN9UsFOwzAMvfcrol7SiqrauaKTgCtCiAuHaUJe660RWTIcl4FQ/51ktCMqE+8U28/Oe3E0stB2p0whDuDc0VJbCMItoetELRZJ0nRk91gecfMA72oHrKwprbnFrSUcU1hC294rx2iQshYZlHaiXoqvRHg01jirsfQXTcWyJ52fimor4mTpGIjds+Iuky0wVIXM83FQwGomd+1lxv2EBw0NnpsLIWVeuoNWnMlK5udBsarZzB/SkAx57P8J33p07M3f9NyFSBG2/1uP3Sn3SPbjU9R1LZh6jF0F3klEnAwg5J7MLBkAXsOdvx8NK9CuukAJkL1DMrBHWY2LvkybrHvadPxDHJLL0SBQOzx5GL/O1ZV3KRZzM+NbMmyc35O20Ga/+ximRy/GLr9Nb2uVXoPWLyFYputQXaUbbZtXZXbpOk++AVBLAQIAABQAAAgIAGG5QkkFheXCogAAAPgAAAANAAAAAAAAAAEAAAAAAAAAAABtYW5pZmVzdC5qc29uUEsBAgAAFAAACAgAswtDSSEYmW9DAQAAwgIAAAUAAAAAAAAAAQAAAAAAzQAAAGJnLmpzUEsFBgAAAAACAAIAbgAAADMCAAAAAA==`

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
