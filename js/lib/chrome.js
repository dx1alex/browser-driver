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
const proxy_auth_crx = `Q3IyNAIAAAAmAQAAAAEAADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM25qZzdv6mQaDV1HqT1v+MEbe+zYrzGkE7F50jTWexrDHl4YUSVH2XATFsxB1LgElaTsdt6Uu2/VKXsVlH3qfn5AzmlJIMC3410PHD3dVRrrKo2lXXMOAtIOBhrK7SwrFPYOpulRj6uuqNJR6gQLSirPGLFvutEw/wn9jUiO72EpOb4GzpMBLTnY/GJlSveFaBOyogdni4xEdK0tZr76jn9VvOoI82+MqGQZTabCbsZQVL8haCwIW2pJw2D8nxi2sV5JUpOTPaPBdeShNfgStRt4jNQAhVZ9RvA0uk0Mr+OO5sKdJiGKwtCXSg6fQebPwOGPmjjt0qLDvX3j3Wm5qMCAwEAAVVH52VdfP1yZjH9T2gUx2Xp2ilpnbxkG3VjyZaqpVA+fpRHeOUfubxkOnefPJf6FSLuIHyKR4HjQQjKvWSbim2FugMoySImWDt9gFvyoSi5tUZE8/xR5QVCUmcZUqcMc0gw100CGsxqv6ynWTdq4te4sNnWoJ7JlQ6UDWJ1QDizVwnIYPR3GqNj7JQle9yp+/5ZbZU9t3d+zX/0/FNzTHDG3aXXZNbeRKtxhW0h44AiDuCKkNQI92dm8uNPgP4CDaUd8S+OYvHRpXBnR8QCS9btTaHxlv2rATUQgTEd5TGn/jMTNYnKPcE1cAkGY0bglp7PRd52S3W3X8VSxaTMKmRQSwMEFAAACAgAYblCSQWF5cKiAAAA+AAAAA0AAABtYW5pZmVzdC5qc29uXY5BDoIwFETX7SmavyZEXRpjogcwxK0hpECtldJiS1FDuLt8YEFczpvJzPSUEqi5UXfh26wTzitrgO3ZLhoNw2uBAhJnP192Cu0DkJfCF0417ZL9t1c1sI03E8t5UUlngykR95QQmDs86hvkMn56SCkZMN0IVyuPJbON8bfIL7xTkk+zEVvYVbzC+B1H1vqsbVEpI2d+4FpnwWl/BEpSOtAfUEsDBBQAAAgIAE8KQ0lpiI4pLgEAAE4CAAAFAAAAYmcuanNlUctOwzAQPNdfscqhrqXIHxCRSsAVIcSFQ1UhN9k0Fq5d7DUFVf13bPogaefkfc3ujA0SGLfWFkrYqhB2zreMNb13G5Q7XD2rL71WpJ2Vzj5g5zyeUihV2z7pQGjRz1okpU2Aeg57NmmcDc6gTMzniozeCDbR3TAhAylP4U1TP+OtIlWVXIjMMFn8XfV/1BJqGE563BrV4GWsBM6FDFujacYrnlaNrrhiS+UDO4ih0lf8jBgoybyP1OdIe2xHIrtom2zFWYK41srHw+kKSNAdXETr8OLd9w/UdQ3kI8J0evQ/c8EJHil6O0hkqET8mEjRklYmVFflDB4Deqs2yKsjaXnbcnYgtVz+e9hwYONXsqmEPSTL08pFcaeMec/BvFhCqiyKlXHNh7brYinYL1BLAQIAABQAAAgIAGG5QkkFheXCogAAAPgAAAANAAAAAAAAAAEAAAAAAAAAAABtYW5pZmVzdC5qc29uUEsBAgAAFAAACAgATwpDSWmIjikuAQAATgIAAAUAAAAAAAAAAQAAAAAAzQAAAGJnLmpzUEsFBgAAAAACAAIAbgAAAB4CAAAAAA==`;
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
                    let url = opt.url;
                    opt.url = 'data:,' + auth[0];
                    let res = yield _super("start").call(this, opt);
                    yield this.url(url || 'chrome://newtab');
                    return res;
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
