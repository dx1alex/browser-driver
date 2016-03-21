"use strict";
const browser_1 = require('./browser');
const path = require('path');
class Chrome extends browser_1.Browser {
    constructor(options) {
        super(options);
        this.options = updateOptions(this.options);
    }
    start(options) {
        return super.start(updateOptions(Object.assign({}, this.options, options)));
    }
}
exports.Chrome = Chrome;
function updateOptions(options) {
    const args = options.desiredCapabilities.chromeOptions.args;
    if (options.dir) {
        setOpt(args, 'user-data-dir', path.join(options.dir, options.user ? options.user + '' : '0'));
    }
    if (typeof options.fullscreen === 'boolean') {
        setOpt(args, 'start-fullscreen', options.fullscreen);
    }
    if (options.useragent) {
        setOpt(args, 'user-agent', options.fullscreen);
    }
    if (typeof options.disableFlash === 'boolean') {
        setOpt(args, 'disable-bundled-ppapi-flash', options.disableFlash);
    }
    return options;
}
function setOpt(args, opt, value) {
    const i = args.findIndex(v => v.indexOf(opt) >= 0);
    if (typeof value === 'boolean') {
        if (i >= 0) {
            if (!value)
                args.splice(i, 1);
        }
        else {
            if (value)
                args.push(opt);
        }
    }
    else {
        const val = opt + '=' + value;
        if (i >= 0)
            args[i] = val;
        else
            args.push(val);
    }
}
