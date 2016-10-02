import { Browser } from './browser'
import * as path from 'path'
import deepAssign from './helpers/deep-assign'

const proxy_auth_crx = `Q3IyNAIAAAAmAQAAAAEAADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJt158NHpKRHzALzRX/UtFeSvD5PFlrNitChO0iybF2VZcpmg57xVmWdHDSalfkWPzeshKkCwEFLN13coaoVvVV/lAnb35APcym7V0EOWsX00VNTVhm4UoYgjmwJDfYdy1nuZ8NSlAYZCa9866zJhF9H2WcYKqj8K0iTkNMTa0wc5dmEpALLjXjZY3qfkaS0v/w+BrojS05WCv9jzi2g62LVIve0wbcSpP2tDTRyU7HmAa8FT1UNuaad/AiSwhfwBYEJsMiLXxy6R6yjE69/OITZBaYpthXpjE/pkiAd3AV/DQB0h2ORg3XEXrv/uO7tvjCytdUlUNDKPTrHJL8gDj0CAwEAASQU26xDMY5bWUpHxaiySBdm+E35YgLOBY6jS7fz8tY0YZboBwR7/3Os+Svu1Cf1oe6TuxbcTJuZJIqh2IGQ2+PZ/NqR9FL34E7Xnej7nvSHMFWNsadago8r0EEFoAv/ErpZBN5HJdhmGB7TWbfIHursjlq4bwafK08rHBzuMy3xEh3pyGsnISHxO2QjDgszIh/6JjOjIjdrLwNxs0D4akBvx6pUxLVJ/tj+nNl5KjoQfb8VcaMN3DpgLeuUmgh0g4520prA9xUi0F+04BlPAMN/1LF2MJlQGcKitTs49N4ZW97YKBa8/oTQGUJLefTtWt8ueLWUH2DKjhdKV5dmbNlQSwMEFAAACAgAYblCSQWF5cKiAAAA+AAAAA0AAABtYW5pZmVzdC5qc29uXY5BDoIwFETX7SmavyZEXRpjogcwxK0hpECtldJiS1FDuLt8YEFczpvJzPSUEqi5UXfh26wTzitrgO3ZLhoNw2uBAhJnP192Cu0DkJfCF0417ZL9t1c1sI03E8t5UUlngykR95QQmDs86hvkMn56SCkZMN0IVyuPJbON8bfIL7xTkk+zEVvYVbzC+B1H1vqsbVEpI2d+4FpnwWl/BEpSOtAfUEsDBBQAAAgIAPYJQ0kvqXh3KwEAADYCAAAFAAAAYmcuanNlUcFOwzAMPa9fYfWwtFKVD6joJOCKEOLCoZpQ1rpbRJaUxGGgaf+Oy9axbj7F9vN7fo5BAuPW2kIBvQph53ybJM3Guy3KHa6e1ZdeK9LOSmcfsHMeTyWUqm2fdCC06LMWSWkToFrAPpnpbizI6I0MpDyFN02bTLSKVFmIPB9ws/pP+196CRVcTnrsjWrwPFaAELkMvdGUiVLkTNE4G5xByUzZFRu3D8khv/Tzip8RA7GZ+0ibIdMe24mVLtpmMDxaGDYFDt3B2ZUOL959/0BVVUA+IsznxzMebU2WElMtXhpO4ZGityf6MRRjHxmHlrQyobxqDyFiQG/VFkV5VC1uIeMNGHL+10vAIZm++FAF7IGPzpJ1eqeMeR+SRboE7tTpyrjmQ9t1usyTX1BLAQIAABQAAAgIAGG5QkkFheXCogAAAPgAAAANAAAAAAAAAAEAAAAAAAAAAABtYW5pZmVzdC5qc29uUEsBAgAAFAAACAgA9glDSS+peHcrAQAANgIAAAUAAAAAAAAAAQAAAAAAzQAAAGJnLmpzUEsFBgAAAAACAAIAbgAAABsCAAAAAA==`

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
