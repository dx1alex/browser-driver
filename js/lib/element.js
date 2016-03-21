"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const helpers_1 = require('./helpers');
const scripts_1 = require('./scripts');
class Element {
    constructor(selector, browser, from, id) {
        this.browser = browser;
        this.id = null;
        this.query = null;
        this.selector = null;
        this.sessionId = null;
        this._promiseELEMENT = null;
        this.webdriver = null;
        this.webdriver = browser.webdriver;
        this.sessionId = browser.sessionId;
        const self = this;
        if (id) {
            _findStrategy(selector);
            this._promiseELEMENT = Promise.resolve({ value: { ELEMENT: id } });
        }
        else if (!selector) {
            this._promiseELEMENT = this.webdriver.getActiveElement({ sessionId: this.sessionId });
        }
        else if (typeof selector !== 'string') {
            throw new TypeError('selector must be: NULL or string of css selector');
        }
        else if (from) {
            if (from instanceof Element) {
                this._promiseELEMENT = from.ELEMENT.then(res => {
                    return this.webdriver.findChildElement(Object.assign({ sessionId: this.sessionId, id: res }, _findStrategy(selector)));
                });
            }
            else {
                this._promiseELEMENT = this.webdriver.findElement(Object.assign({ sessionId: this.sessionId }, helpers_1.findStrategy(from)))
                    .then(res => {
                    return res;
                })
                    .then(res => {
                    return this.webdriver.findChildElement(Object.assign({ sessionId: this.sessionId, id: res.value.ELEMENT }, _findStrategy(selector)));
                });
            }
        }
        else {
            this._promiseELEMENT = this.webdriver.findElement(Object.assign({ sessionId: this.sessionId }, _findStrategy(selector)));
        }
        this._promiseELEMENT.catch(_throw);
        function _throw(err) {
            throw err;
        }
        function _findStrategy(selector) {
            self.selector = selector;
            return self.query = helpers_1.findStrategy(selector);
        }
        return new Proxy(this, {
            get: (self, name) => {
                if (typeof this[name] === 'function' && name != 'ELEMENT' && this.browser.pause > 0) {
                    return (...args) => {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                resolve(this[name](...args));
                            }, this.browser.pause);
                        });
                    };
                }
                return this[name];
            }
        });
    }
    get ELEMENT() {
        if (this.id !== null)
            return Promise.resolve(this.id);
        return this._promiseELEMENT.then(res => this.id = res.value.ELEMENT);
    }
    click(wait) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.clickElement({ sessionId: this.sessionId, id: yield this.ELEMENT });
            if (wait)
                return this.browser.executeAsync((wait, done) => setTimeout(() => done(window.location.href), wait), wait);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.clearElement({ sessionId: this.sessionId, id: yield this.ELEMENT });
        });
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webdriver.submitElement({ sessionId: this.sessionId, id: yield this.ELEMENT });
        });
    }
    keys(keys, submit) {
        return __awaiter(this, void 0, void 0, function* () {
            const k = [].concat(keys);
            let value = [];
            for (let charSet of k) {
                value = value.concat(helpers_1.checkUnicode(charSet));
            }
            yield this.webdriver.typeElement({ sessionId: this.sessionId, id: yield this.ELEMENT, value: value });
            if (submit)
                yield this.submit();
        });
    }
    text() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webdriver.getElementText({ sessionId: this.sessionId, id: yield this.ELEMENT })
                .then(res => res.value);
        });
    }
    hasText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const em = yield this.text();
            if (text instanceof RegExp)
                return text.test(em);
            else
                return em.indexOf(text) >= 0;
        });
    }
    name() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webdriver.getElementTagName({ sessionId: this.sessionId, id: yield this.ELEMENT })
                .then(res => res.value);
        });
    }
    attr(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value !== undefined) {
                return this.browser.execute(scripts_1.setAttribute, {
                    using: this.query.using,
                    value: this.query.value
                }, name, value)
                    .then(res => res.value);
            }
            return this.webdriver.getElementAttribute({ sessionId: this.sessionId, id: yield this.ELEMENT, name: name })
                .then(res => res.value);
        });
    }
    css(propertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webdriver.getElementCssProperty({ sessionId: this.sessionId, id: yield this.ELEMENT, propertyName: propertyName })
                .then(res => helpers_1.parseCSS([res], propertyName));
        });
    }
    size() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webdriver.getElementSize({ sessionId: this.sessionId, id: yield this.ELEMENT })
                .then(res => res.value);
        });
    }
    location() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webdriver.getElementLocation({ sessionId: this.sessionId, id: yield this.ELEMENT })
                .then(res => res.value);
        });
    }
    locationInView() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webdriver.getElementLocationInView({ sessionId: this.sessionId, id: yield this.ELEMENT })
                .then(res => res.value);
        });
    }
    isSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webdriver.isElementSelected({ sessionId: this.sessionId, id: yield this.ELEMENT })
                .then(res => res.value);
        });
    }
    isEnabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webdriver.isElementEnabled({ sessionId: this.sessionId, id: yield this.ELEMENT })
                .then(res => res.value);
        });
    }
    isReadonly() {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield this.attr('readonly'));
        });
    }
    isVisible() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webdriver.isElementDysplayed({ sessionId: this.sessionId, id: yield this.ELEMENT })
                .then(res => res.value);
        });
    }
    isEqual(em) {
        return __awaiter(this, void 0, void 0, function* () {
            let other = null;
            if (typeof em === 'string') {
                em = new Element(em, this.browser);
            }
            if (em instanceof Element) {
                other = yield em.ELEMENT;
            }
            return this.webdriver.isElementEqual({ sessionId: this.sessionId, id: yield this.ELEMENT, other: other })
                .then(res => res.value);
        });
    }
    is() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.webdriver.getElementTagName({ sessionId: this.sessionId, id: yield this.ELEMENT })
                .then(res => true)
                .catch(res => {
                if (res.status == 10)
                    return false;
                throw res;
            });
        });
    }
    prop(name, value) {
        return this.browser.execute(scripts_1.setProperty, {
            using: this.query.using,
            value: this.query.value
        }, name, value);
    }
    val(value) {
        return this.attr('value', value);
    }
    type(keys, submit) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clear();
            yield this.keys(keys, submit);
        });
    }
    select(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(options)) {
                options = [options];
            }
            else if (options.length == 1 && typeof options[0] === 'number') {
                options = [options];
            }
            yield this.click();
            if (yield this.attr('multiple')) {
                yield this.browser.keys(['Control']);
                yield this.click();
                yield this.browser.keys(['Control']);
            }
            let ems = null;
            for (let option of options) {
                let em = null;
                if (Array.isArray(option)) {
                    let n = option[0];
                    if (ems === null)
                        ems = yield this.browser.elements('option', this);
                    if (n < ems.length && n >= 0) {
                        em = ems[n];
                    }
                    else
                        throw new TypeError('select option number incorrect index');
                }
                else if (typeof option === 'string' && option.startsWith('*=')) {
                    em = this.browser.element('option*=' + option.slice(2), this);
                }
                else if (typeof option === 'string' && option.startsWith('=')) {
                    em = this.browser.element('option=' + option.slice(1), this);
                }
                else {
                    em = this.browser.element(`option[value="${option}"]`, this);
                }
                yield em.click();
            }
        });
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.attr('checked'))) {
                yield this.click();
                return true;
            }
            return false;
        });
    }
    uncheck() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.attr('checked')) {
                yield this.click();
                return true;
            }
            return false;
        });
    }
    event(type, options) {
        return this.browser.execute(scripts_1.dispatchEvent, {
            using: this.query.using,
            value: this.query.value
        }, type, options);
    }
    on(type) {
        return this.browser.executeAsync(scripts_1.addEventListener, {
            using: this.query.using,
            value: this.query.value
        }, type);
    }
}
exports.Element = Element;
