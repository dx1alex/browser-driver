"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const webdriver_wire_protocol_1 = require('webdriver-wire-protocol');
const element_1 = require('./element');
const helpers_1 = require('./helpers');
const scripts_1 = require('./scripts');
const KEYS = [
    "NULL", "Cancel", "Help", "Back_space", "Tab", "Clear", "Return", "Enter", "Shift", "Control", "Alt", "Meta",
    "Pause", "Escape", "Semicolon", "Equals", "Insert", "Delete", "Space",
    "Pageup", "Pagedown", "End", "Home", "Left_arrow", "Up_arrow", "Right_arrow", "Down_arrow",
    "Numpad_0", "Numpad_1", "Numpad_2", "Numpad_3", "Numpad_4", "Numpad_5", "Numpad_6", "Numpad_7", "Numpad_8", "Numpad_9",
    "Multiply", "Add", "Separator", "Subtract", "Decimal", "Divide",
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"
];
class Browser {
    constructor(options) {
        this.options = options;
        this.gm = null;
        this.anticaptcha = null;
        this.key = {};
        this.sessionId = null;
        this.capabilities = null;
        this.webdriver = null;
        this.defaults = {
            timeouts: {
                script: 60 * 1000,
                implicit: 1000,
                page_load: 60 * 1000
            }
        };
        this.pause = 0;
        this.$_ = {};
        this.$$_ = [];
        this.webdriver = new webdriver_wire_protocol_1.default(this.options.init);
        this.anticaptcha = this.options.init.anticaptcha;
        this.gm = this.options.init.gm;
        for (let k of KEYS)
            this.key[k] = () => __awaiter(this, void 0, void 0, function* () { return this.keys(k.replace('_', ' ')); });
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    start(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sessionId !== null)
                throw new Error('Session is open');
            options = Object.assign({}, this.options, options);
            if (options.proxy) {
                options.desiredCapabilities.proxy = {
                    proxyType: 'manual',
                    httpProxy: options.proxy,
                    sslProxy: options.proxy,
                };
            }
            const res = yield this.webdriver.initSession(options);
            this.sessionId = res.sessionId;
            this.capabilities = res.value;
            yield this.setTimeouts(this.defaults.timeouts);
            if (options.maximize) {
                yield this.maximize();
            }
            else {
                if (options.size)
                    yield this.setSize(options.size[0], options.size[1]);
                if (options.position)
                    yield this.setPosition(options.position[0], options.position[1]);
            }
            if (options.url) {
                yield this.url(options.url);
            }
            return this.sessionId;
        });
    }
    getStatus() {
        return this.webdriver.getStatus()
            .then(res => res.value);
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.quit({ sessionId: this.sessionId });
            this.capabilities = null;
            this.sessionId = null;
            this.$_ = null;
            this.$$_ = null;
        });
    }
    setDefaultTimeouts(options) {
        if ('script' in options)
            this.defaults.timeouts.script = options.script;
        if ('implicit' in options)
            this.defaults.timeouts.implicit = options.implicit;
        if ('page_load' in options)
            this.defaults.timeouts.page_load = options.page_load;
    }
    setTimeouts(options, ms) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options === 'string') {
                yield this.webdriver.setTimeout({
                    sessionId: this.sessionId,
                    type: options, ms: ms || this.defaults.timeouts[options.replace(' ', '_')]
                });
            }
            else if (options && typeof options === 'object') {
                if ('script' in options)
                    yield this.setTimeouts('script', options.script);
                if ('implicit' in options)
                    yield this.setTimeouts('implicit', options.implicit);
                if ('page_load' in options)
                    yield this.setTimeouts('page load', options.page_load);
            }
            else {
                yield this.setTimeouts('script');
                yield this.setTimeouts('implicit');
                yield this.setTimeouts('page load');
            }
        });
    }
    setScriptTimeout(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.setScriptTimeout({ sessionId: this.sessionId, ms });
        });
    }
    setImplicitWait(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.setImplicitWait({ sessionId: this.sessionId, ms });
        });
    }
    setPageLoad(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.setTimeout({ sessionId: this.sessionId, type: 'page load', ms });
        });
    }
    getTab() {
        return this.webdriver.getWindow({ sessionId: this.sessionId })
            .then(res => res.value);
    }
    getTabs() {
        return this.webdriver.getWindows({ sessionId: this.sessionId })
            .then(res => res.value);
    }
    switchTab(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.switchToWindow({ sessionId: this.sessionId, name });
        });
    }
    newTab(switchto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.keys(['NULL', 'Control', 't', 'Control']);
            const tabs = yield this.getTabs();
            const tab = tabs[tabs.length - 1];
            if (switchto)
                yield this.switchTab(tab);
            return tab;
        });
    }
    newWindow(switchto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.keys(['NULL', 'Control', 'n', 'Control']);
            const tabs = yield this.getTabs();
            const tab = tabs[tabs.length - 1];
            if (switchto)
                yield this.switchTab(tab);
            return tab;
        });
    }
    setPosition(windowHandle, x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof windowHandle === 'number') {
                y = x;
                x = windowHandle;
                windowHandle = 'current';
            }
            yield this.webdriver.setWindowPosition({ sessionId: this.sessionId, windowHandle, x, y });
        });
    }
    getPosition(windowHandle) {
        return this.webdriver.getWindowPosition({ sessionId: this.sessionId, windowHandle: windowHandle || 'current' })
            .then(res => res.value);
    }
    setSize(windowHandle, width, height) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof windowHandle === 'number') {
                height = width;
                width = windowHandle;
                windowHandle = 'current';
            }
            yield this.webdriver.setWindowSize({ sessionId: this.sessionId, windowHandle, width, height });
        });
    }
    getSize(windowHandle) {
        return this.webdriver.getWindowSize({ sessionId: this.sessionId, windowHandle: windowHandle || 'current' })
            .then(res => res.value);
    }
    getViewSize() {
        return this.execute(function () {
            return {
                screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                screenHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            };
        })
            .then(res => {
            return {
                width: res.screenWidth || 0,
                height: res.screenHeight || 0
            };
        });
    }
    maximize(windowHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.maximizeWindow({ sessionId: this.sessionId, windowHandle: windowHandle || 'current' });
        });
    }
    close(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name) {
                const tab = yield this.getTab();
                if (name !== tab) {
                    yield this.switchTab(name);
                    yield this.close();
                    yield this.switchTab(tab);
                }
            }
            else {
                yield this.webdriver.closeWindow({ sessionId: this.sessionId });
            }
        });
    }
    url(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (url) {
                yield this.webdriver.openUrl({ sessionId: this.sessionId, url });
            }
            return this.webdriver.getUrl({ sessionId: this.sessionId })
                .then(res => res.value);
        });
    }
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.openUrl({ sessionId: this.sessionId, url });
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.refresh({ sessionId: this.sessionId });
        });
    }
    back() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.goBack({ sessionId: this.sessionId });
        });
    }
    forward() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.goForward({ sessionId: this.sessionId });
        });
    }
    html() {
        return this.webdriver.getSource({ sessionId: this.sessionId })
            .then(res => res.value);
    }
    title() {
        return this.webdriver.getTitle({ sessionId: this.sessionId })
            .then(res => res.value);
    }
    setCookie(cookie) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.setCookie({ sessionId: this.sessionId, cookie });
        });
    }
    getCookies() {
        return this.webdriver.getCookies({ sessionId: this.sessionId })
            .then(res => res.value);
    }
    deleteCookie(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.deleteCookie({ sessionId: this.sessionId, name });
        });
    }
    deleteAllCookies() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.deleteAllCookies({ sessionId: this.sessionId });
        });
    }
    setPrompt(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.setAlertPrompt({ sessionId: this.sessionId, text });
        });
    }
    getDialog() {
        return this.webdriver.getAlertMessage({ sessionId: this.sessionId })
            .then(res => res.value);
    }
    acceptDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.acceptAlert({ sessionId: this.sessionId });
        });
    }
    dismissDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.dismissAlert({ sessionId: this.sessionId });
        });
    }
    dialog(accept, text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (accept === undefined)
                return this.getDialog();
            if (text)
                yield this.setPrompt(text);
            if (accept)
                yield this.acceptDialog();
            else
                yield this.dismissDialog();
        });
    }
    switchFrame(id) {
        return __awaiter(this, void 0, void 0, function* () {
            id = id || null;
            if (id instanceof element_1.Element) {
                id = yield id.ELEMENT;
            }
            yield this.webdriver.switchToFrame({ sessionId: this.sessionId, id });
        });
    }
    switchParentFrame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.switchToParentFrame({ sessionId: this.sessionId });
        });
    }
    keys(keys, ...more) {
        return __awaiter(this, void 0, void 0, function* () {
            const k = [].concat(keys, more);
            let value = [];
            for (let charSet of k) {
                value = value.concat(helpers_1.checkUnicode(charSet));
            }
            yield this.webdriver.type({ sessionId: this.sessionId, value });
        });
    }
    capture(path, crop, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof crop === 'string' || crop instanceof element_1.Element) {
                const em = this.element(crop);
                const size = yield em.size();
                const location = yield em.locationInView();
                offset = offset || {};
                return this.capture(path, {
                    x: location.x + (offset.x || 0),
                    y: location.y + (offset.y || 0),
                    width: size.width + (offset.width || 0),
                    height: size.height + (offset.height || 0)
                });
            }
            const base64 = yield this.webdriver.screenshot({ sessionId: this.sessionId }).then(res => res.value);
            if (path === 'buffer' && !crop)
                return new Buffer(base64, 'base64');
            if (path === 'base64' && !crop)
                return base64;
            if (path === 'dataUri' && !crop)
                return 'data:image/png;base64,' + base64;
            return new Promise((resolve, reject) => {
                const buffer = new Buffer(base64, 'base64');
                const img = this.gm(buffer, 'img.png').size((err, info) => {
                    if (err)
                        throw err;
                    if (crop) {
                        img.crop(crop.width || info.width, crop.height || info.height, crop.x || 0, crop.y || 0);
                    }
                    if (path === 'base64' || path === 'dataUri' || path === 'buffer') {
                        img.toBuffer('PNG', (err, buf) => {
                            if (err)
                                throw err;
                            if (path === 'buffer')
                                resolve(buf);
                            if (path === 'base64')
                                resolve(buf.toString('base64'));
                            if (path === 'dataUri')
                                resolve('data:image/png;base64,' + buf.toString('base64'));
                        });
                    }
                    else {
                        img.write(path, err => {
                            if (err)
                                throw err;
                            resolve();
                        });
                    }
                });
            });
        });
    }
    captcha(selector, crop, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const em = this.element(selector);
            const img = require('os').tmpdir() + `/captcha_${Math.random().toString(16).substr(2)}.png`;
            yield this.capture(img, crop);
            const res = yield this.anticaptcha.recognize(img, options);
            yield em.keys(res.code.trim());
            return res;
        });
    }
    execute(script, ...args) {
        script = typeof script === 'function' ? `return (${script}).apply(null, arguments)` : script;
        return this.webdriver.executeScript({ sessionId: this.sessionId, script, args })
            .then(res => res.value);
    }
    executeAsync(script, ...args) {
        script = typeof script === 'function' ? `return (${script}).apply(null, arguments)` : script;
        return this.webdriver.executeAsyncScript({ sessionId: this.sessionId, script, args })
            .then(res => res.value);
    }
    mouseDoubleClick() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.mouseDoubleClick({ sessionId: this.sessionId });
        });
    }
    mouseClick(button) {
        return __awaiter(this, void 0, void 0, function* () {
            button = button || 0;
            yield this.webdriver.mouseClick({ sessionId: this.sessionId, button });
        });
    }
    mouseUp(button) {
        return __awaiter(this, void 0, void 0, function* () {
            button = button || 0;
            yield this.webdriver.mouseUp({ sessionId: this.sessionId, button });
        });
    }
    mouseDown(button) {
        return __awaiter(this, void 0, void 0, function* () {
            button = button || 0;
            yield this.webdriver.mouseDown({ sessionId: this.sessionId, button });
        });
    }
    mouseMove(element, xoffset, yoffset) {
        return __awaiter(this, void 0, void 0, function* () {
            xoffset = xoffset || 0;
            yoffset = yoffset || 0;
            if (typeof element === 'number') {
                yoffset = xoffset;
                xoffset = element;
                element = null;
            }
            else if (element) {
                element = yield this.element(element).ELEMENT;
            }
            else {
                element = null;
            }
            yield this.webdriver.mouseMoveTo({ sessionId: this.sessionId, element, xoffset, yoffset });
        });
    }
    click(selector, target, bg) {
        return __awaiter(this, void 0, void 0, function* () {
            const em = this.element(selector);
            if (target)
                yield em.attr('target', target);
            if (bg)
                yield this.keys(['Control']);
            yield em.click();
            if (bg)
                yield this.keys(['Control']);
        });
    }
    scroll(selector, align, y, x) {
        return __awaiter(this, void 0, void 0, function* () {
            y = y || 0;
            x = x || 0;
            if (typeof align === 'number') {
                x = y;
                y = align;
                align = null;
            }
            let loc = {}, size = {};
            if (selector) {
                const em = this.element(selector);
                loc = yield em.location();
                size = yield em.size();
            }
            if (align == 'center') {
                y += size.height ? size.height / 2 : 0;
            }
            if (align == 'bottom') {
                y += size.height ? size.height : 0;
            }
            y += (loc.y || 0);
            x += (loc.x || 0);
            return this.execute(scripts_1.scroll, x, y, selector ? (align || 'top') : false);
        });
    }
    isExists(selector, from) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.elements(selector, from).then(res => res.length)) > 0;
        });
    }
    hasText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield this.element('body').text();
            if (text instanceof RegExp)
                return text.test(body);
            else
                return body.indexOf(text) >= 0;
        });
    }
    form(selector, data, submit, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = options || {};
            options.addFild = options.addFild || false;
            options.setInvisible = options.setInvisible || false;
            options.setDisabled = options.setDisabled || false;
            options.pause = options.pause || 0;
            let set = (em, data) => __awaiter(this, void 0, void 0, function* () {
                let isVisible = yield em.isVisible();
                let isEnabled = yield em.isEnabled();
                if (isVisible && isEnabled) {
                    yield em.type(data);
                }
                else if (options.setInvisible != isVisible && options.setDisabled != isEnabled) {
                    yield em.attr('value', data);
                }
            });
            let form = yield this.element(selector);
            for (let name of Object.keys(data)) {
                if (options.pause)
                    yield new Promise(resolve => setTimeout(resolve, options.pause));
                let method = 'name';
                let id = null;
                let ems = null;
                if (name.startsWith('$=')) {
                    id = name.slice(2);
                    method = 'selector';
                }
                else if (name.startsWith('*=')) {
                    id = 'label*=' + name.slice(2);
                    method = 'label';
                }
                else if (name.startsWith('=')) {
                    id = 'label=' + name.slice(1);
                    method = 'label';
                }
                if (method == 'label') {
                    id = yield this.element(id, form).attr('for');
                    ems = [yield this.element('#' + id)];
                }
                else if (method == 'selector') {
                    ems = yield this.elements(id, form);
                }
                else {
                    ems = yield this.elements(`[name="${name}"]`, form);
                }
                if (ems.length > 0) {
                    let last = ems.length - 1;
                    let em = ems[last];
                    let tag = yield em.name();
                    let type = yield em.attr('type');
                    if (tag === 'input') {
                        if (type === 'checkbox') {
                            if (data[name])
                                yield em.check();
                            else
                                yield em.uncheck();
                        }
                        else if (type === 'radio') {
                            if (Array.isArray(data[name])) {
                                let n = data[name][0];
                                if (n >= 0 && n <= last) {
                                    em = ems[n];
                                    yield em.check();
                                }
                                else
                                    throw new TypeError('radio number incorrect index');
                            }
                            else {
                                em = yield this.element(`input[type="radio"][value="${data[name]}"]`, form);
                                yield em.check();
                            }
                        }
                        else if (type === 'file') {
                            yield em.type(data[name]);
                        }
                        else if (type === 'hidden') {
                            console.log('hidden');
                            yield em.attr('value', data[name]);
                            console.log(yield em.attr('value'));
                        }
                        else {
                            yield set(em, data[name]);
                        }
                    }
                    else if (tag === 'textarea') {
                        yield set(em, data[name]);
                    }
                    else if (tag === 'select') {
                        yield em.select(data[name]);
                    }
                }
                else if (options.addFild) {
                    let id = Math.random().toString(16).substr(2);
                    yield this.execute(scripts_1.addField, form.query, data[name], id);
                }
            }
            if (submit) {
                return form.submit();
            }
        });
    }
    element(selector, from) {
        if (selector instanceof element_1.Element) {
            return selector;
        }
        return new element_1.Element(selector || null, this, from);
    }
    $(selector, from) {
        return this.$_ = this.element(selector, from);
    }
    elements(selector, from) {
        let _elements = (res) => {
            let elements = [];
            for (let id of res.value)
                elements.push(new element_1.Element(selector, this, null, id.ELEMENT));
            return elements;
        };
        if (from) {
            if (from instanceof element_1.Element) {
                return from.ELEMENT.then(res => {
                    return this.webdriver.findChildElements(Object.assign({ sessionId: this.sessionId, id: res }, helpers_1.findStrategy(selector)));
                })
                    .then(_elements);
            }
            else if (typeof from === 'string') {
                return this.webdriver.findElement(Object.assign({ sessionId: this.sessionId }, helpers_1.findStrategy(from)))
                    .then(res => {
                    return this.webdriver.findChildElements(Object.assign({
                        sessionId: this.sessionId, id: res.value.ELEMENT
                    }, helpers_1.findStrategy(selector)));
                })
                    .then(_elements);
            }
            else {
                throw new TypeError('child must be: object Element or string of css selector');
            }
        }
        return this.webdriver.findElements(Object.assign({ sessionId: this.sessionId }, helpers_1.findStrategy(selector)))
            .then(_elements);
    }
    $$(selector, from) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.$$_ = yield this.elements(selector, from);
        });
    }
}
exports.Browser = Browser;
