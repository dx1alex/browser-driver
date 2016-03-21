import {Browser} from './browser'
import * as path from 'path'

export class Chrome extends Browser {
  constructor(options) {
    super(options)
    this.options = updateOptions(this.options)
  }
  start(options?) {
    return super.start(updateOptions(Object.assign({}, this.options, options)))
  }
}

function updateOptions(options: any) {
  const args = options.desiredCapabilities.chromeOptions.args
  if (options.dir) {
    setOpt(args, 'user-data-dir', path.join(options.dir, options.user ? options.user + '' : '0'))
  }
  if (typeof options.fullscreen === 'boolean') {
    setOpt(args, 'start-fullscreen', options.fullscreen)
  }
  if (options.useragent) {
    setOpt(args, 'user-agent', options.fullscreen)
  }
  if (typeof options.disableFlash === 'boolean') {
    setOpt(args, 'disable-bundled-ppapi-flash', options.disableFlash)
  }
  return options
}

function setOpt(args: string[], opt: string, value: string | boolean) {
  const i = args.findIndex(v => v.indexOf(opt) >= 0)
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
