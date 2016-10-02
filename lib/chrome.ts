import { Browser } from './browser'
import * as path from 'path'
import deepAssign from './helpers/deep-assign'

const proxy_auth_crx = `Q3IyNAIAAAAmAQAAAAEAADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANhwX5RHZKv+FfTfkmPnEWftzSJ+hYFaG39XUx2K+XIZEDvDlhBA5GjRV+oIeGS32l/7IVbNhHZuxzbHmiV00MFQ/qjXQiAoRa34w+TJ5v3P7qLZ3CVibmfGr8GrV8ChE4qlMvfyYtNOQJsY6wHcoBI7UtdT8NNM/5beKiEjZo+OekSFuOcukBV7Ubr4ID2umH7NQJgj7n0f6Wgdjg+5pSz3ildxqS7NNabqpciEaui+vG2dLQrCbRVaok16x8H5XuKJtWoQdQk7ZkD1UwiSc1pI+iiYdb8NC/eMxg+fqwcdyvP5pj5Yddp39PfsMFCt4V9jczW05rCEjKndbdR4U08CAwEAAc6php4t5Hc1qL16/SBXmNVyUeVXk0uf610AoN4acuW3SJSaRwlUO9AQxsC5CqlbyQu30DaNbib4aFPhQ9vS+R3HD5OPKJOiB5EHgn+9Ku3ZXVRckDo1jruTLxoRZ0Tp8EVXuum2I/nnKMgzqyv94/KDeCxcNlEhOPtKk0xug/O4Sv3Q9TEm+SrBmoOphB1x+VvU8gsANl9yLjSdCw1qjUFFXiNFeP6SkZLYQA21X8b+/9i1PvCGJ68ohuQtT2Hj5+zhrrX0wrVj6k0hsVgJbN4xUygmhuLvYauHEBDVB626go5pmkb8iBV2y7+twYQDhCTfWJcneDyjXuSoylXTrctQSwMEFAAACAgAZyBDSedW4pWYAAAA4wAAAA0AAABtYW5pZmVzdC5qc29uXY7NCoJAFIXXM08hdx1SLSOCeoJoGyKj3mxyfmyu0w/iu+fNFtLyfOfwcXopwCqnL0hd/sBA2jtINsl6MRZOWeQAx+Bf72Qfuyswr5DKoNvut/2vZxpYpcsvK1TZ1MFHVzHupRAwOYjzGYo6vRFkUgy8bjFYTSyZap4/sTjhPY4/WTjPB+PLRrt64ltlTB6DoR1IkclBfgBQSwMEFAAACAgAgihDSYGNq+QFAQAA+AEAAAUAAABiZy5qc21Ry2rDMBC8+ysWHyIbjHw3daD02kPppQdjgmJvY1FFcrVr0lL875WIE9ykc9rHaHYYGWQw7qBtAaMiOjnfJ93g3RHlCfev+DkhsXT2ceIhdtpjL1XfP2titOizHllpQ1Bv4SeBAP0Ol6GcvJHEyjO9aR4yMTCPVVmO3n1971SQLEWeL+8imhsrLdSw1vI4GtXhv0IFCJFLGo3mTFQiv4p2zpIzKIN2dqN/Js13vjW9RGWo6xrYTwibzTmltVmPPHm7GkREL08hI7SslaHqZh0hJkJv1RFFtUR/T7kYDJTrt6wJc/K3mpO5WE6FnMLZJn1Qxuxis03buG3SvXHdh7aHtM2TX1BLAQIAABQAAAgIAGcgQ0nnVuKVmAAAAOMAAAANAAAAAAAAAAEAAAAAAAAAAABtYW5pZmVzdC5qc29uUEsBAgAAFAAACAgAgihDSYGNq+QFAQAA+AEAAAUAAAAAAAAAAQAAAAAAwwAAAGJnLmpzUEsFBgAAAAACAAIAbgAAAOsBAAAAAA==`

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
          "startup_urls": ["http://proxy_auth/" + auth[0]]
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
