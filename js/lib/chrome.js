"use strict";
const browser_1 = require('./browser');
const path = require('path');
class Chrome extends browser_1.Browser {
    constructor(options) {
        super(updateOptions(options));
    }
    start(options) {
        return super.start(updateOptions(this.options, options));
    }
}
exports.Chrome = Chrome;
function updateOptions(options, opt) {
    options = clone(options);
    if (opt)
        options = Object.assign(options, opt);
    if (options.dir)
        options.desiredCapabilities.chromeOptions.args.push('--user-data-dir=' + path.join(options.dir, options.user ? options.user + '' : 'Default'));
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
