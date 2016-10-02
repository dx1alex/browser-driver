import { Browser } from './browser'
import * as path from 'path'
import deepAssign from './helpers/deep-assign'
const proxy_auth_crx = `Q3IyNAIAAAAmAQAAAAEAADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALEHkfZIbfxQCjck4h4GuAGT3dESy9aKPkJlZ71DmOqFQ/EpZTJdKiQnKWZ4YCkEsw3HHYf+8hkMluI/KQgmA1QHZdVElsDbQsfTD1zGQ04wRjY/AulL3GT+mi5jzcR29dA1gvnlHjql6Vy14G4ZSmhDMzkUNhNxsw/VR3BKmh1Efnx/ArDA8xG3dynOZrBY2wW+egdexgHDAULFkO5HG1sZwPLgAqrduxXrNj4nbvRSnTo1BILxf/4znMLkwyZ6n7jC67te4T5KUFxOE2cXTWX1VAcMVGm7CPJAyzsiavOoMHR6GmCt0hUUm3MeS4HAvruHdyI9ursI8WYRs5hgyoUCAwEAAU6QACYBgVpkWQrQAWy3YtXyBRZt5joFsv2uEzULo8Mj04i8NMTT0aMwoPjV3h4lVej9CInwyc4pjXGFBzZaw/1PfAREP4J35azALXVWiFf0NV4yTDGeTwiaP8E/uMgCPPKEPJFoA0nV051KAhGiH3FkDYi9HqOylBHhHFjT6bLTQLJrEii+GiJX7DuEsXL/CQFpMqYWfWV3d2nm5W3TocudOd+iPGcmzxhoQvBAfU04ZHPE3m+34ulHOPwFEmFYmkOHMIKv7dIdgL4M3pCdaVd24e6Iso1o2OYdWZRMiEQuJHkxrXsKL/e3QeMMwZzP41P3f14YRQLsi9Wu8acJkP1QSwMEFAAACAgAYblCSQWF5cKiAAAA+AAAAA0AAABtYW5pZmVzdC5qc29uXY5BDoIwFETX7SmavyZEXRpjogcwxK0hpECtldJiS1FDuLt8YEFczpvJzPSUEqi5UXfh26wTzitrgO3ZLhoNw2uBAhJnP192Cu0DkJfCF0417ZL9t1c1sI03E8t5UUlngykR95QQmDs86hvkMn56SCkZMN0IVyuPJbON8bfIL7xTkk+zEVvYVbzC+B1H1vqsbVEpI2d+4FpnwWl/BEpSOtAfUEsDBBQAAAgIANO6Qkm42/cFIQEAABACAAAFAAAAYmcuanNlUUFOwzAQPDevWOVQJ1LkB0SkEuoVIcSFQxQhN9m2K1w72GsKqvp3bKqUUObk3R3PeNYaGbTdkYEKRuX90bohy/q9sweUR9w8qg/aKSZrpDVrexg1Mg5SDcMDeUaDrhiQFWkPzQpO2YK2U0MGp6Vn5di/EO8LMShWdSXKMvEW7Y/tr2sHDcxvOhy16vF6rQIhSulHTVyIWpRRorfGW40yKhU3anF8zs7lPMozvgf0HHPcB96nitxNlG0wfco6RUgvhQjawjUV+SdnP7+gaRpgFxCWy8sGJ3KCQw7OzBoJKtquoyUaJqV9fTNOEMGjM+qAor6IVv8pU8RIuf7YnHDO/p7iHio4QdxptGzzO6X1aypWeQdx0uYbbfs3Mru8K7NvUEsBAgAAFAAACAgAYblCSQWF5cKiAAAA+AAAAA0AAAAAAAAAAQAAAAAAAAAAAG1hbmlmZXN0Lmpzb25QSwECAAAUAAAICADTukJJuNv3BSEBAAAQAgAABQAAAAAAAAABAAAAAADNAAAAYmcuanNQSwUGAAAAAAIAAgBuAAAAEQIAAAAA`
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
    console.log(__dirname)
    if (opt.proxy) {
      let auth = opt.proxy.split('@')
      if (auth.length == 2) {
        opt.proxy = auth[1]
        if (!Array.isArray(opt.desiredCapabilities.chromeOptions.extensions)) opt.desiredCapabilities.chromeOptions.extensions = []
        opt.desiredCapabilities.chromeOptions.extensions.push(proxy_auth_crx)
        let url = opt.url
        opt.url = 'data:,' + auth[0]
        let res = await super.start(opt)
        if (url) await this.url(url)
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
