"use strict";
const browser_1 = require('./browser');
const path = require('path');
const deep_assign_1 = require('./helpers/deep-assign');
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
                '--disable-gpu',
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
};
class Chrome extends browser_1.Browser {
    constructor(options) {
        super(options);
        this.options = updateOptions(this.options);
    }
    start(options) {
        return super.start(updateOptions(Object.assign({}, this.options, options)));
    }
    userDataDir() {
        return this.capabilities.crome.userDataDir;
    }
}
exports.Chrome = Chrome;
function updateOptions(options) {
    if (!options.desiredCapabilities.chromeOptions)
        options.desiredCapabilities.chromeOptions = {};
    if (!Array.isArray(options.desiredCapabilities.chromeOptions.args))
        options.desiredCapabilities.chromeOptions.args = [];
    const args = options.desiredCapabilities.chromeOptions.args;
    let userDir;
    if (options.dir) {
        userDir = path.join(options.dir, options.user ? options.user + '' : '0');
        setOpt(args, 'user-data-dir', userDir);
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
    if (options.prefs && userDir) {
        const fs = require('fs');
        const preferences = userDir + '/Default/Preferences';
        try {
            const prefs = fs.readFileSync(preferences, 'utf8');
            let data = JSON.parse(prefs);
            data = deep_assign_1.default(data, options.prefs);
            fs.writeFileSync(preferences, JSON.stringify(data), 'utf8');
        }
        catch (e) {
        }
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
