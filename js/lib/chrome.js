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
const proxy_ext = 'Q3IyNAIAAAAmAQAAAAEAADCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANZ+/nyKeW6kqt7XAKwWlEgEgfx/OfxYv+7pEHIv9EDFmBorOlEd4P025pxitO8n8byWkw475kHMTodnN+7lSKVMup4RomeXPxzirAZPuy4rnsWsNTHLdrDZ7RBDgBqF4LnOo9RPwEarfX5Osyk6pQwYb+JyDrde9iBmpt28wGjsh3/gHxJQsv4vKB54U4BFEdiQBAdgACfnx+cEgSn7vvIW23JfuPyNohvSKiu9RtbZJnlp1dqLYjv8hycVQs3P+hy9hcmJJWobWyRUH4J8ha7D11dlI9CcKo3YKyjGCbl3Kf77JiBpK8oDuLxNiyVbI86hzLGGhdGM41qBk8UROrECAwEAASf+0bAdNmACXDPV6Li91lkEfkpEIE3uGE8OtQ27wOOXza+iDFEBJNCW9GCKuY3M9T3DYTjHd6PCn2sf8zQY6Gl6gqJmNuLwNZRkTuk/dJUjzxvmKlrr3LK26nN6oTjkhJXVgPaJPVTtZcA45rF+/ICohJwDbKA0Ilbtq3xSgq3OqqcZCQf5nPvhErpCf8T3+0BkeEDuu2W3h8ZGubCktNN2lfUImXYyk7zlyFYgIiOsmIvtHcfFpJxoHN9w23hMDpzKMf0QUR3L8jolQc1T0oVuLBBvYSqw5GhMUt4gme5mqNEjckIY4tZZ9mn34bBXbsxFzkAKBi9QycogbLTT5idQSwMEFAAACAgAN6FJSQd+55ibAAAAEwEAAA0AAABtYW5pZmVzdC5qc29uXY7PDoIwDIfvPAXp2RD1aIwHn8B4NYRso5LJ2GAF/4Tw7s5tBrS3fl/7a8ckdQUN0/KK1Bd3tCSNhl26XQWlWYOuhZM1zxdEWCIJK9s+jP66OQI22fpLORN1Zc2gSydGzzwPOeTgBXiV3QhyL6e416JtJH0C/cy8+EB+xm5wT8cTf/SojKilrpa2XfzpwZ4pVQxW0QE8zJMpeQNQSwMEFAAACAgAPKFJSdVUwZcfAgAA0AUAAAUAAABiZy5qc5VUTW+cMBC98yscLmZbxLZXlE2/rj1E7XG1ihyYXawam/ojSRXtf+/YQPACq6o+AON5M29m/IwAS5izTU46rV7+5EQ7SXbkyISBJKkarVoocM9yfCv50zJtXVewuv7OjQUJOss2ZHdHXhNC+DG7QewmGGRIZbWDYA7JAk9hwFouT6aoBDCdvZ43iDkn+BpJn+HxB/x2YCzyfoWj0jDaMXsNlnFhxhKQRkmjBBRCnTI6i6Q5GfCF0wK5fIDAEXRMsxaLjbyFhk6wCjLaWNuV220ofPsJc1A6hPIjyYbQHaGhFTp2v6hlcE/Of86jXxqs0zLKGoKZrECU03T9Oif9M2oLewoFFqYT3Gb082XphQB5so0v/2NceCgqxO4/HPqsBFASEWQfyeYQoHP2faOMRYTSNgD6Rvs6yrGO9SngRzZRPTHhoJxNoFU17qVH/gL1gwH9BNqk+QVEOwFmHueXQRIB955zzR0gVQOtJ/CnP8s7rtDfqsf3XJL3/rXwn5N16zylMpXqkJtqODmBouknO0xsoYeFFvAe5YMfhYwT2KeXGn6XHjxknz4KVf3CYaSHKxfvCx6yt7iG+r/uXRy4eu28AMddbu57we36/0UsRY+78VrbDJ0nb64gMuTjElXGjHlWuvZK8+hYaG+DikqchW2mrKv3zaf8hq0A/gmZWBUVdahCyVqgJemzLyEjHULGz2tquHaSt0yIB2/crR3iX1BLAQIAABQAAAgIADehSUkHfueYmwAAABMBAAANAAAAAAAAAAEAAAAAAAAAAABtYW5pZmVzdC5qc29uUEsBAgAAFAAACAgAPKFJSdVUwZcfAgAA0AUAAAUAAAAAAAAAAQAAAAAAxgAAAGJnLmpzUEsFBgAAAAACAAIAbgAAAAgDAAAAAA==';
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
                if (v.capabilities.chrome.userDataDir == (opt.dir + (opt.user ? require('path').sep + opt.user : '')).toLowerCase()) {
                    yield this.webdriver.quit({ sessionId: v.id });
                }
            }
            opt.desiredCapabilities.chromeOptions.extensions = [proxy_ext];
            return _super("start").call(this, opt);
        });
    }
    userDataDir() {
        return this.capabilities.chrome.userDataDir;
    }
    setProxy(proxy) {
        if (!proxy)
            proxy = 'clear';
        return this.url('http://proxy/?' + proxy);
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
