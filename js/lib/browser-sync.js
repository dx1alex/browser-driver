"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const element_sync_1 = require('./element-sync');
const sync_plus_1 = require('sync-plus');
const webdriver_wire_protocol_1 = require('webdriver-wire-protocol');
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
class BrowserSync {
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
        this.$_ = {};
        this.$$_ = [];
        this.webdriver = new webdriver_wire_protocol_1.default(this.options.init);
        this.anticaptcha = this.options.init.anticaptcha;
        this.gm = this.options.init.gm;
        for (let k of KEYS)
            this.key[k] = (k) => this.keys(k.replace('_', ' '));
    }
    start(options) {
        if (this.sessionId !== null)
            throw new Error('Session is open');
        options = options || this.options;
        if (options.proxy)
            this.options.desiredCapabilities.proxy = options.proxy;
        const res = sync_plus_1.Sync.wait(this.webdriver.initSession(this.options));
        this.sessionId = res.sessionId;
        this.capabilities = res.value;
        this.setTimeouts(this.defaults.timeouts);
        if (options.maximize) {
            this.maximize();
        }
        else {
            if (options.size)
                this.setSize(options.size[0], options.size[1]);
            if (options.position)
                this.setPosition(options.position[0], options.position[1]);
        }
        if (options.url) {
            this.url(options.url);
        }
        return this.sessionId;
    }
    getStatus() {
        return sync_plus_1.Sync.wait(this.webdriver.getStatus()).value;
    }
    quit() {
        sync_plus_1.Sync.wait(this.webdriver.quit({ sessionId: this.sessionId }));
        this.capabilities = null;
        this.sessionId = null;
        this.$_ = null;
        this.$$_ = null;
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
        if (typeof options === 'string') {
            sync_plus_1.Sync.wait(this.webdriver.setTimeout({
                sessionId: this.sessionId,
                type: options, ms: ms || this.defaults.timeouts[options.replace(' ', '_')]
            }));
        }
        else if (options && typeof options === 'object') {
            if ('script' in options)
                this.setTimeouts('script', options.script);
            if ('implicit' in options)
                this.setTimeouts('implicit', options.implicit);
            if ('page_load' in options)
                this.setTimeouts('page load', options.page_load);
        }
        else {
            this.setTimeouts('script');
            this.setTimeouts('implicit');
            this.setTimeouts('page load');
        }
    }
    setScriptTimeout(ms) {
        sync_plus_1.Sync.wait(this.webdriver.setScriptTimeout({ sessionId: this.sessionId, ms: ms }));
    }
    setImplicitWait(ms) {
        sync_plus_1.Sync.wait(this.webdriver.setImplicitWait({ sessionId: this.sessionId, ms: ms }));
    }
    setPageLoad(ms) {
        sync_plus_1.Sync.wait(this.webdriver.setTimeout({ sessionId: this.sessionId, type: 'page load', ms: ms }));
    }
    getTab() {
        return sync_plus_1.Sync.wait(this.webdriver.getWindow({ sessionId: this.sessionId })).value;
    }
    getTabs() {
        return sync_plus_1.Sync.wait(this.webdriver.getWindows({ sessionId: this.sessionId })).value;
    }
    switchTab(name) {
        sync_plus_1.Sync.wait(this.webdriver.switchToWindow({ sessionId: this.sessionId, name: name }));
    }
    setPosition(windowHandle, x, y) {
        if (typeof windowHandle === 'number') {
            y = x;
            x = windowHandle;
            windowHandle = 'current';
        }
        sync_plus_1.Sync.wait(this.webdriver.setWindowPosition({ sessionId: this.sessionId, windowHandle: windowHandle, x: x, y: y }));
    }
    getPosition(windowHandle) {
        return sync_plus_1.Sync.wait(this.webdriver.getWindowPosition({
            sessionId: this.sessionId, windowHandle: windowHandle || 'current'
        })).value;
    }
    setSize(windowHandle, width, height) {
        if (typeof windowHandle === 'number') {
            height = width;
            width = windowHandle;
            windowHandle = 'current';
        }
        sync_plus_1.Sync.wait(this.webdriver.setWindowSize({ sessionId: this.sessionId, windowHandle: windowHandle, width: width, height: height }));
    }
    getSize(windowHandle) {
        return sync_plus_1.Sync.wait(this.webdriver.getWindowSize({
            sessionId: this.sessionId, windowHandle: windowHandle || 'current'
        })).value;
    }
    getViewSize() {
        const res = this.execute(function () {
            return {
                screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                screenHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            };
        });
        return {
            width: res.screenWidth || 0,
            height: res.screenHeight || 0
        };
    }
    maximize(windowHandle) {
        sync_plus_1.Sync.wait(this.webdriver.maximizeWindow({ sessionId: this.sessionId, windowHandle: windowHandle || 'current' }));
    }
    close(name) {
        if (name) {
            const tab = this.getTab();
            if (name !== tab) {
                this.switchTab(name);
                this.close();
                this.switchTab(tab);
            }
        }
        else
            sync_plus_1.Sync.wait(this.webdriver.closeWindow({ sessionId: this.sessionId }));
    }
    url(url) {
        if (url) {
            sync_plus_1.Sync.wait(this.webdriver.openUrl({ sessionId: this.sessionId, url: url }));
        }
        return sync_plus_1.Sync.wait(this.webdriver.getUrl({ sessionId: this.sessionId })).value;
    }
    get(url) {
        sync_plus_1.Sync.wait(this.webdriver.openUrl({ sessionId: this.sessionId, url: url }));
    }
    refresh() {
        sync_plus_1.Sync.wait(this.webdriver.refresh({ sessionId: this.sessionId }));
    }
    back() {
        sync_plus_1.Sync.wait(this.webdriver.goBack({ sessionId: this.sessionId }));
    }
    forward() {
        sync_plus_1.Sync.wait(this.webdriver.goForward({ sessionId: this.sessionId }));
    }
    html() {
        return sync_plus_1.Sync.wait(this.webdriver.getSource({ sessionId: this.sessionId })).value;
    }
    title() {
        return sync_plus_1.Sync.wait(this.webdriver.getTitle({ sessionId: this.sessionId })).value;
    }
    setCookie(cookie) {
        sync_plus_1.Sync.wait(this.webdriver.setCookie({ sessionId: this.sessionId, cookie: cookie }));
    }
    getCookies() {
        return sync_plus_1.Sync.wait(this.webdriver.getCookies({ sessionId: this.sessionId })).value;
    }
    deleteCookie(name) {
        sync_plus_1.Sync.wait(this.webdriver.deleteCookie({ sessionId: this.sessionId, name: name }));
    }
    deleteAllCookies() {
        sync_plus_1.Sync.wait(this.webdriver.deleteAllCookies({ sessionId: this.sessionId }));
    }
    setPrompt(text) {
        sync_plus_1.Sync.wait(this.webdriver.setAlertPrompt({ sessionId: this.sessionId, text: text }));
    }
    getDialog() {
        return sync_plus_1.Sync.wait(this.webdriver.getAlertMessage({ sessionId: this.sessionId })).value;
    }
    acceptDialog() {
        sync_plus_1.Sync.wait(this.webdriver.acceptAlert({ sessionId: this.sessionId }));
    }
    dismissDialog() {
        sync_plus_1.Sync.wait(this.webdriver.dismissAlert({ sessionId: this.sessionId }));
    }
    dialog(accept, text) {
        if (accept === undefined)
            return this.getDialog();
        if (text)
            this.setPrompt(text);
        if (accept)
            this.acceptDialog();
        else
            this.dismissDialog();
    }
    switchFrame(id = null) {
        if (id instanceof element_sync_1.ElementSync) {
            id = id.ELEMENT;
        }
        sync_plus_1.Sync.wait(this.webdriver.switchToFrame({ sessionId: this.sessionId, id: id }));
    }
    switchParentFrame() {
        sync_plus_1.Sync.wait(this.webdriver.switchToParentFrame({ sessionId: this.sessionId }));
    }
    keys(keys, ...more) {
        const k = [].concat(keys, more);
        let value = [];
        for (let charSet of k) {
            value = value.concat(helpers_1.checkUnicode(charSet));
        }
        sync_plus_1.Sync.wait(this.webdriver.type({ sessionId: this.sessionId, value: value }));
    }
    capture(path, crop, offset) {
        if (typeof crop === 'string' || crop instanceof element_sync_1.ElementSync) {
            const em = this.element(crop);
            const size = em.size();
            const location = em.locationInView();
            offset = offset || {};
            return this.capture(path, {
                x: location.x + (offset.x || 0),
                y: location.y + (offset.y || 0),
                width: size.width + (offset.width || 0),
                height: size.height + (offset.height || 0)
            });
        }
        const base64 = sync_plus_1.Sync.wait(this.webdriver.screenshot({ sessionId: this.sessionId })).value;
        if (path === 'buffer' && !crop)
            return new Buffer(base64, 'base64');
        if (path === 'base64' && !crop)
            return base64;
        if (path === 'dataUri' && !crop)
            return 'data:image/png;base64,' + base64;
        const buffer = new Buffer(base64, 'base64');
        return sync_plus_1.Sync.run(done => {
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
                            done(null, buf);
                        if (path === 'base64')
                            done(null, buf.toString('base64'));
                        if (path === 'dataUri')
                            done(null, 'data:image/png;base64,' + buf.toString('base64'));
                    });
                }
                else {
                    img.write(path, err => {
                        if (err)
                            throw err;
                        done();
                    });
                }
            });
        });
    }
    captcha(selector, crop, options) {
        const em = this.element(selector);
        const img = require('os').tmpdir() + `/captcha_${Math.random().toString(16).substr(2)}.png`;
        this.capture(img, crop);
        const res = this.anticaptcha.recognize(img, options);
        em.keys(res.code.trim());
        return res;
    }
    execute(script, ...args) {
        script = typeof script === 'function' ? `return (${script}).apply(null, arguments)` : script;
        return sync_plus_1.Sync.wait(this.webdriver.executeScript({ sessionId: this.sessionId, script: script, args: args })).value;
    }
    executeAsync(script, ...args) {
        script = typeof script === 'function' ? `return (${script}).apply(null, arguments)` : script;
        return sync_plus_1.Sync.wait(this.webdriver.executeAsyncScript({ sessionId: this.sessionId, script: script, args: args })).value;
    }
    mouseDoubleClick() {
        sync_plus_1.Sync.wait(this.webdriver.mouseDoubleClick({ sessionId: this.sessionId }));
    }
    mouseClick(button) {
        button = button || 0;
        sync_plus_1.Sync.wait(this.webdriver.mouseClick({ sessionId: this.sessionId, button: button }));
    }
    mouseUp(button) {
        button = button || 0;
        sync_plus_1.Sync.wait(this.webdriver.mouseUp({ sessionId: this.sessionId, button: button }));
    }
    mouseDown(button) {
        button = button || 0;
        sync_plus_1.Sync.wait(this.webdriver.mouseDown({ sessionId: this.sessionId, button: button }));
    }
    mouseMove(element, xoffset, yoffset) {
        xoffset = xoffset || 0;
        yoffset = yoffset || 0;
        if (typeof element === 'number') {
            yoffset = xoffset;
            xoffset = element;
            element = null;
        }
        else if (element) {
            element = this.element(element).ELEMENT;
        }
        else {
            element = null;
        }
        sync_plus_1.Sync.wait(this.webdriver.mouseMoveTo({ sessionId: this.sessionId, element: element, xoffset: xoffset, yoffset: yoffset }));
    }
    click(selector, target, bg) {
        const em = this.element(selector);
        if (target)
            em.attr('target', target);
        if (bg)
            this.keys(['Control']);
        em.click();
        if (bg)
            this.keys(['Control']);
    }
    scroll(selector, align, y, x) {
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
            loc = em.location();
            size = em.size();
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
    }
    isExists(selector, parent) {
        return this.elements(selector, parent).length > 0;
    }
    hasText(text) {
        const body = this.element('body').text();
        if (text instanceof RegExp)
            return text.test(body);
        else
            return body.indexOf(text) >= 0;
    }
    form(selector, data, submit, options) {
        options = options || {};
        options.addFild = options.addFild || false;
        options.setInvisible = options.setInvisible || false;
        options.setDisabled = options.setDisabled || false;
        options.pause = options.pause || 0;
        let set = (em, data) => __awaiter(this, void 0, void 0, function* () {
            let isVisible = em.isVisible();
            let isEnabled = em.isEnabled();
            if (isVisible && isEnabled) {
                em.type(data);
            }
            else if (options.setInvisible != isVisible && options.setDisabled != isEnabled) {
                em.attr('value', data);
            }
        });
        let form = this.element(selector);
        for (let name of Object.keys(data)) {
            if (options.pause)
                sync_plus_1.Sync.sleep(options.pause);
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
                id = this.element(id, form).attr('for');
                ems = [this.element('#' + id)];
            }
            else if (method == 'selector') {
                ems = this.elements(id, form);
            }
            else {
                ems = this.elements(`[name="${name}"]`, form);
            }
            if (ems.length > 0) {
                let last = ems.length - 1;
                let em = ems[last];
                let tag = em.name();
                let type = em.attr('type');
                if (tag === 'input') {
                    if (type === 'checkbox') {
                        if (data[name])
                            em.check();
                        else
                            em.uncheck();
                    }
                    else if (type === 'radio') {
                        if (Array.isArray(data[name])) {
                            let n = data[name][0];
                            if (n >= 0 && n <= last) {
                                em = ems[n];
                                em.check();
                            }
                            else
                                throw new TypeError('radio number incorrect index');
                        }
                        else {
                            em = this.element(`input[type="radio"][value="${data[name]}"]`, form);
                            em.check();
                        }
                    }
                    else if (type === 'file') {
                        em.type(data[name]);
                    }
                    else if (type === 'hidden') {
                        console.log('hidden');
                        em.attr('value', data[name]);
                        console.log(em.attr('value'));
                    }
                    else {
                        set(em, data[name]);
                    }
                }
                else if (tag === 'textarea') {
                    set(em, data[name]);
                }
                else if (tag === 'select') {
                    em.select(data[name]);
                }
            }
            else if (options.addFild) {
                let id = Math.random().toString(16).substr(2);
                this.execute(scripts_1.addField, form.query, data[name], id);
            }
        }
        if (submit) {
            return form.submit();
        }
    }
    element(selector, parent) {
        if (selector instanceof element_sync_1.ElementSync) {
            return selector;
        }
        return new element_sync_1.ElementSync(selector || null, this, parent);
    }
    $(selector, parent) {
        return this.$_ = this.element(selector, parent);
    }
    elements(selector, parent) {
        let _elements = (ids = []) => {
            let elements = [];
            for (let id of ids) {
                id = id.ELEMENT;
                elements.push(new element_sync_1.ElementSync(selector, this, null, id));
            }
            return elements;
        };
        if (parent) {
            if (parent instanceof element_sync_1.ElementSync) {
                return _elements(sync_plus_1.Sync.wait(this.webdriver.findChildElements(Object.assign({ sessionId: this.sessionId, id: parent.id }, helpers_1.findStrategy(selector)))).value);
            }
            else if (typeof parent === 'string') {
                let id = sync_plus_1.Sync.wait(this.webdriver.findElement(Object.assign({ sessionId: this.sessionId }, helpers_1.findStrategy(parent)))).value;
                return _elements(sync_plus_1.Sync.wait(this.webdriver.findChildElements(Object.assign({
                    sessionId: this.sessionId, id: id
                }, helpers_1.findStrategy(selector)))).value);
            }
            else {
                throw new TypeError('child must be: object Element or string of css selector');
            }
        }
        return _elements(sync_plus_1.Sync.wait(this.webdriver.findElements(Object.assign({ sessionId: this.sessionId }, helpers_1.findStrategy(selector)))).value);
    }
    $$(selector, parent) {
        return this.$$_ = this.elements(selector, parent);
    }
}
exports.BrowserSync = BrowserSync;
