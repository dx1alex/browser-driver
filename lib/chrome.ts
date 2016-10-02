import { Browser } from './browser'
import * as path from 'path'
import deepAssign from './helpers/deep-assign'

const proxy_auth_crx = `Q3IyNAIAAAAmAQAAAAEAADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMKFryuPsXdgObtrT6DgxVTZYR07LiAs8wuFESEmd0r+kAspw4gekIut3tIYygnDlllNPv4i6POFf3zXlUQ9HLU/1tVMBUjN1+wPwFpt8ML5MjHemdlrGhr2jCwI+peYmSuJ8qMiIr8fNhitSIHn2Y3yUXvjYBy2qC+vBaW297ARHOeFb7J+cAGvCmfArDXq9GXtltFPLjGzeihrL3aZNllGppdGHGjgBXh3Dsj2cUNR0VcG/cPgF8JJ9V2M74k8VdpWbxwjFRsReg/NqhKQAn9g/Rat9nASA1bkgAhS58bEU1WAwB1ALthkkRq7xPnO+BIyPKWMu8duAuDrp71JnjsCAwEAAY8Q1lBtjKReipSl3++KFs+Pf5c8srpO5T45YNqOeVEkjHszPbb/qPEXiznZaED/DBzHZU2tPQ+lVlw+vKo7EicCeGQhN//VgDYRJ200eW7NJEw23hVZFgU3n6/altxNXOO4RwCrGPtOrOHRdWv+8Nrx1VkXS4bnnESVOOyyvu1luWW/79oTu3QplxjV4W2b19rw1e+DOqfC2E3I2cQvmm4V6qnbiZAOgcSDwVhIE5XBEeev45D0LGL8GeVx1l4xWWQfJFbvmKYnUrEppCfWVbkGjYxN1DPM20HHZ+awfH1Oo/tKWKh4Vg/mJNMJNbFMr+yZmI8n1ALWMzU9F6bDpwVQSwMEFAAACAgAZyBDSedW4pWYAAAA4wAAAA0AAABtYW5pZmVzdC5qc29uXY7NCoJAFIXXM08hdx1SLSOCeoJoGyKj3mxyfmyu0w/iu+fNFtLyfOfwcXopwCqnL0hd/sBA2jtINsl6MRZOWeQAx+Bf72Qfuyswr5DKoNvut/2vZxpYpcsvK1TZ1MFHVzHupRAwOYjzGYo6vRFkUgy8bjFYTSyZap4/sTjhPY4/WTjPB+PLRrt64ltlTB6DoR1IkclBfgBQSwMEFAAACAgAjCVDSZKSUsoUAQAAEgIAAAUAAABiZy5qc4VRsWrDMBDd/RXCQ2SDkZMuBVOllK4dSpcOxgTFvsaiiuRKJ9JS/O+ViBPcZMjTojs93nu6U4BEmZ3UBRmEcwdju6TtrdkDO8D2Db48OGRGP3nsYyUtdEx03Yt0CBps1gEKqRzha/KbkAD5QU5N5q1iDoVF9y6xz2iPOFRlubq7Z8twVtWyfBys+f7ZiKDPaZ5PIhH1Ra6GcDIXtjAo0cJt1YJQmjM3KIkZrWh+dmiNdkYBC0bZhdmRNF79SLrXqEw45wStB7JYHOc3T24BvdWzRkTM8hymBxqlUK66eI6g3oHVYg+0mpZyTTkFDJTzwuaEMfl/G5OxmKzC0IJtnT4IpTaxWKdNfK3TrTLtp9S7tMmTP1BLAQIAABQAAAgIAGcgQ0nnVuKVmAAAAOMAAAANAAAAAAAAAAEAAAAAAAAAAABtYW5pZmVzdC5qc29uUEsBAgAAFAAACAgAjCVDSZKSUsoUAQAAEgIAAAUAAAAAAAAAAQAAAAAAwwAAAGJnLmpzUEsFBgAAAAACAAIAbgAAAPoBAAAAAA==`

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
        if (!opt.desiredCapabilities.chromeOptions.prefs) opt.desiredCapabilities.chromeOptions.prefs = {}
        opt.desiredCapabilities.chromeOptions.prefs.session = {
          "restore_on_startup": 4,
          "startup_urls": ["http://127.0.0.1:0/?proxy_auth=" + auth[0]]
        }
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
