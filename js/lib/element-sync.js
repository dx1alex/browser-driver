"use strict";
const sync_plus_1 = require('sync-plus');
const helpers_1 = require('./helpers');
const scripts_1 = require('./scripts');
class ElementSync {
    constructor(selector, browser, parent, id) {
        this.browser = browser;
        this.id = null;
        this.query = null;
        this.selector = null;
        this.sessionId = null;
        this.webdriver = null;
        this.webdriver = browser.webdriver;
        this.sessionId = browser.sessionId;
        const self = this;
        if (id) {
            this.id = id;
            _findStrategy(selector);
        }
        else if (!selector) {
            this.id = sync_plus_1.Sync.wait(this.webdriver.getActiveElement({ sessionId: this.sessionId })).value.ELEMENT;
        }
        else if (typeof selector !== 'string') {
            throw new TypeError('selector must be: NULL or string of css selector');
        }
        else if (parent) {
            if (parent instanceof ElementSync) {
                this.id = sync_plus_1.Sync.wait(this.webdriver.findChildElement(Object.assign({ sessionId: this.sessionId, id: parent.id }, _findStrategy(selector)))).value.ELEMENT;
            }
            else {
                let em = sync_plus_1.Sync.wait(this.webdriver.findElement(Object.assign({ sessionId: this.sessionId }, helpers_1.findStrategy(parent)))).value.ELEMENT;
                this.id = sync_plus_1.Sync.wait(this.webdriver.findChildElement(Object.assign({ sessionId: this.sessionId, id: em.id }, _findStrategy(selector)))).value.ELEMENT;
            }
        }
        else {
            this.id = sync_plus_1.Sync.wait(this.webdriver.findElement(Object.assign({ sessionId: this.sessionId }, _findStrategy(selector)))).value.ELEMENT;
        }
        function _findStrategy(selector) {
            self.selector = selector;
            return self.query = helpers_1.findStrategy(selector);
        }
    }
    get ELEMENT() {
        return this.id;
    }
    click() {
        sync_plus_1.Sync.wait(this.webdriver.clickElement({ sessionId: this.sessionId, id: this.ELEMENT }));
    }
    clear() {
        sync_plus_1.Sync.wait(this.webdriver.clearElement({ sessionId: this.sessionId, id: this.ELEMENT }));
    }
    submit() {
        sync_plus_1.Sync.wait(this.webdriver.submitElement({ sessionId: this.sessionId, id: this.ELEMENT }));
    }
    keys(keys, submit) {
        const k = [].concat(keys);
        let value = [];
        for (let charSet of k) {
            value = value.concat(helpers_1.checkUnicode(charSet));
        }
        sync_plus_1.Sync.wait(this.webdriver.typeElement({ sessionId: this.sessionId, id: this.ELEMENT, value: value }));
        if (submit)
            this.submit();
    }
    text() {
        return sync_plus_1.Sync.wait(this.webdriver.getElementText({ sessionId: this.sessionId, id: this.ELEMENT })).value;
    }
    hasText(text) {
        const em = this.text();
        if (text instanceof RegExp)
            return text.test(em);
        else
            return em.indexOf(text) >= 0;
    }
    name() {
        return sync_plus_1.Sync.wait(this.webdriver.getElementTagName({ sessionId: this.sessionId, id: this.ELEMENT })).value;
    }
    attr(name, value) {
        if (value !== undefined) {
            return this.browser.execute(scripts_1.setAttribute, {
                using: this.query.using,
                value: this.query.value
            }, name, value);
        }
        return sync_plus_1.Sync.wait(this.webdriver.getElementAttribute({ sessionId: this.sessionId, id: this.ELEMENT, name: name })).value;
    }
    css(propertyName) {
        let res = sync_plus_1.Sync.wait(this.webdriver.getElementCssProperty({ sessionId: this.sessionId, id: this.ELEMENT, propertyName: propertyName }));
        return helpers_1.parseCSS([res], propertyName);
    }
    size() {
        return sync_plus_1.Sync.wait(this.webdriver.getElementSize({ sessionId: this.sessionId, id: this.ELEMENT })).value;
    }
    location() {
        return sync_plus_1.Sync.wait(this.webdriver.getElementLocation({ sessionId: this.sessionId, id: this.ELEMENT })).value;
    }
    locationInView() {
        return sync_plus_1.Sync.wait(this.webdriver.getElementLocationInView({ sessionId: this.sessionId, id: this.ELEMENT })).value;
    }
    isSelected() {
        return sync_plus_1.Sync.wait(this.webdriver.isElementSelected({ sessionId: this.sessionId, id: this.ELEMENT })).value;
    }
    isEnabled() {
        return sync_plus_1.Sync.wait(this.webdriver.isElementEnabled({ sessionId: this.sessionId, id: this.ELEMENT })).value;
    }
    isReadonly() {
        return !!(this.attr('readonly'));
    }
    isVisible() {
        return sync_plus_1.Sync.wait(this.webdriver.isElementDysplayed({ sessionId: this.sessionId, id: this.ELEMENT })).value;
    }
    isEqual(em) {
        let other = null;
        if (typeof em === 'string') {
            em = new ElementSync(em, this.browser);
        }
        if (em instanceof ElementSync) {
            other = em.ELEMENT;
        }
        return sync_plus_1.Sync.wait(this.webdriver.isElementEqual({ sessionId: this.sessionId, id: this.ELEMENT, other: other })).value;
    }
    is() {
        try {
            sync_plus_1.Sync.wait(this.webdriver.getElementTagName({ sessionId: this.sessionId, id: this.ELEMENT }));
        }
        catch (e) {
            if (e.status == 10)
                return false;
            throw e;
        }
        return true;
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
        this.clear();
        this.keys(keys, submit);
    }
    select(options) {
        if (!Array.isArray(options)) {
            options = [options];
        }
        else if (options.length == 1 && typeof options[0] === 'number') {
            options = [options];
        }
        this.click();
        if (this.attr('multiple')) {
            this.browser.keys(['Control']);
            this.click();
            this.browser.keys(['Control']);
        }
        let ems = null;
        for (let option of options) {
            let em = null;
            if (Array.isArray(option)) {
                let n = option[0];
                if (ems === null)
                    ems = this.browser.elements('option', this);
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
            em.click();
        }
    }
    check() {
        if (!(this.attr('checked'))) {
            this.click();
            return true;
        }
        return false;
    }
    uncheck() {
        if (this.attr('checked')) {
            this.click();
            return true;
        }
        return false;
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
exports.ElementSync = ElementSync;
