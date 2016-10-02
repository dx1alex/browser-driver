"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const browser_1 = require('./browser');
const path = require('path');
const deep_assign_1 = require('./helpers/deep-assign');
const proxy_auth_crx = `Q3IyNAIAAAAmAQAAAAEAADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALsC2HwPOgm3ir1J8LQcv86J7j+HwvqDbvLncyEw+A3FXrLdaCspHKxc6vSCxR1fx/FZausVxak3nzpnT1D0l9KcrjjkBlmxx5JTfH8r1LHDA8Lv50vYtWoDRDB0ZjOwhJKhEWb/1dEUGn1ur2VCBVxTPHFjcCr74B/6hPR3Euq/mQxW9MeOHQvFmLG2H9FLmCK5cavZ7qf5kRJl3DCHUGYBS+IHCn2+MwInaLnxheNurItxvsvR7Qk/vcgJFdK9XbRYNpS9tRIR414MBP+TsMgbftU4cZ3PiBdVDbJ1ECm8VcZhIaXa/+UFh/+lxujXsj64oa0L6iWjORoli+Uw2BUCAwEAATvX+3D01bDPJHyL2dOPxhHc+ANY2jIKdMtqSOW/qzFntCeIaZT0bcIJJFUHhQ3tKMKpjQnZmg7pfNswP6seUvt9l2VypVSGrIG7PsdG+D9vQJ99r6DDpCKSh+eLnagUH8M9rCJPVrCSC7j9gev/jxDjbD2V19rmi9pTvqbUZzt++5J6GXeUjs2jhErPs/jGB/UBSiT0WwUA6qQwPuYwLgrgXNxdv+mike3PktWwUmEibsj33MrPyDz6jY5vXzMkvIMIOmQYHsjkmtIF6jiI+8mRaPR8hwiHKWHPH4v6/vg6TOYPO58j3zzcczYmH4C1cS/nziDuRXYmeOTj7ylJ+JRQSwMEFAAACAgAZyBDSedW4pWYAAAA4wAAAA0AAABtYW5pZmVzdC5qc29uXY7NCoJAFIXXM08hdx1SLSOCeoJoGyKj3mxyfmyu0w/iu+fNFtLyfOfwcXopwCqnL0hd/sBA2jtINsl6MRZOWeQAx+Bf72Qfuyswr5DKoNvut/2vZxpYpcsvK1TZ1MFHVzHupRAwOYjzGYo6vRFkUgy8bjFYTSyZap4/sTjhPY4/WTjPB+PLRrt64ltlTB6DoR1IkclBfgBQSwMEFAAACAgA+CFDSaoabjYEAQAA9gEAAAUAAABiZy5qc21Ry2rDMBC8+ysWHyIbjD7AVIHSaw+llx6MCYq1TUQVyZVWpKX43ysRJ7hO57SP0ewwMkhg3EHbBkYZwtl5VQxH707Iz7h/xc+Igbizj5GOudMeFZdKPetAaNFXCklqE0Bs4aeABP0O1yGP3vBA0lN403SsmJIk22b07ut7J5OiYHU9P8voVk56ELCU8jgaOeB/Og0wVvMwGk0Va1l90xycDc4gT9LVSv5Cmu5c6/CSlUEIAeQjwmZzyWjp1SNFbxeDjOzlKSWElrQ0oV2tM1gM6K08IWvn4O8pV4OJcvuUJWEq/lZTMTXzqRRTOtuVD9KYXW62ZZ+3Xbk3bvjQ9lD2dfELUEsBAgAAFAAACAgAZyBDSedW4pWYAAAA4wAAAA0AAAAAAAAAAQAAAAAAAAAAAG1hbmlmZXN0Lmpzb25QSwECAAAUAAAICAD4IUNJqhpuNgQBAAD2AQAABQAAAAAAAAABAAAAAADDAAAAYmcuanNQSwUGAAAAAAIAAgBuAAAA6gEAAAAA`;
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
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let opt = updateOptions(Object.assign({}, this.options, options));
            let sesssions = yield this.webdriver.getSessions();
            for (let v of sesssions.value) {
                if (v.capabilities.chrome.userDataDir.toLowerCase() == (opt.dir + (opt.user ? require('path').sep + opt.user : '')).toLowerCase()) {
                    yield this.webdriver.quit({ sessionId: v.id });
                }
            }
            if (opt.proxy) {
                let auth = opt.proxy.split('@');
                if (auth.length == 2) {
                    opt.proxy = auth[1];
                    if (!Array.isArray(opt.desiredCapabilities.chromeOptions.extensions))
                        opt.desiredCapabilities.chromeOptions.extensions = [];
                    opt.desiredCapabilities.chromeOptions.extensions.push(proxy_auth_crx);
                    if (!opt.desiredCapabilities.chromeOptions.prefs)
                        opt.desiredCapabilities.chromeOptions.prefs = {};
                    opt.desiredCapabilities.chromeOptions.prefs.session = {
                        "restore_on_startup": 4,
                        "startup_urls": ["data:,proxy_auth=" + auth[0]]
                    };
                }
            }
            return _super("start").call(this, opt);
        });
    }
    userDataDir() {
        return this.capabilities.chrome.userDataDir;
    }
    args(opt, value) {
        const args = this.options.desiredCapabilities.chromeOptions.args;
        const i = args.findIndex(v => v.split('=')[0] == opt);
        if (value === undefined) {
            if (i >= 0) {
                let v = args[i].split('=');
                if (v.length > 1) {
                    return v[1];
                }
                return true;
            }
            else {
                return false;
            }
        }
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
            if (i >= 0) {
                args[i] = val;
            }
            else {
                args.push(val);
            }
        }
    }
}
exports.Chrome = Chrome;
function updateOptions(options) {
    if (!options.desiredCapabilities.chromeOptions)
        options.desiredCapabilities.chromeOptions = {};
    if (!Array.isArray(options.desiredCapabilities.chromeOptions.args))
        options.desiredCapabilities.chromeOptions.args = [];
    const args = options.desiredCapabilities.chromeOptions.args;
    let i = 0;
    for (let arg of args) {
        if (arg.startsWith('--')) {
            args[i++] = arg.substr(2);
        }
    }
    let userDir;
    if (options.dir) {
        userDir = path.join(options.dir, options.user ? options.user + '' : '0');
        setOpt(args, 'user-data-dir', userDir);
    }
    if (typeof options.fullscreen === 'boolean') {
        setOpt(args, 'start-fullscreen', options.fullscreen);
    }
    if (options.useragent) {
        setOpt(args, 'user-agent', options.useragent);
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
    const i = args.findIndex(v => v.split('=')[0] == opt);
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
