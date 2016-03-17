import {BrowserSync} from './browser-sync'
import * as path from 'path'

export class ChromeSync extends BrowserSync {
  constructor(options) {
    super(options)
    ChromeSync.prototype.start = (options?) => {
      console.log('start')
      return super.start(updateOptions(this.options, options))
    }
  }
}

function updateOptions(options: any, opt?: any) {
  options = clone(options)
  if (opt) options = Object.assign(options, opt)
  if (options.dir) options.desiredCapabilities.chromeOptions.args.push('--user-data-dir=' + path.join(options.dir, options.user ? options.user + '' : ''))
  if (options.fullscreen) options.desiredCapabilities.chromeOptions.args.push('--start-fullscreen')
  if (options.useragent) options.desiredCapabilities.chromeOptions.args.push('--user-agent=' + options.useragent)
  if (options.disableFlash) options.desiredCapabilities.chromeOptions.args.push('--disable-bundled-ppapi-flash')
  return options
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
