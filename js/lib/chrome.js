"use strict";
const browser_1 = require('./browser');
const path = require('path');
class BrowserSync extends browser_1.Browser {
    constructor(options) {
        super(options);
    }
    start(options) {
        return super.start(updateOptions(this.options, options));
    }
}
exports.BrowserSync = BrowserSync;
function updateOptions(options, opt) {
    options = clone(options);
    if (opt)
        options = Object.assign(options, opt);
    if (options.dir)
        options.desiredCapabilities.chromeOptions.args.push('--user-data-dir=' + path.join(options.dir, options.user ? options.user + '' : ''));
    if (options.fullscreen)
        options.desiredCapabilities.chromeOptions.args.push('--start-fullscreen');
    if (options.useragent)
        options.desiredCapabilities.chromeOptions.args.push('--user-agent=' + options.useragent);
    if (options.disableFlash)
        options.desiredCapabilities.chromeOptions.args.push('--disable-bundled-ppapi-flash');
    return options;
}
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
