import {BrowserSync} from './browser-sync'
import {Sync} from 'sync-plus'
import Webdriver from 'webdriver-wire-protocol'
import {checkUnicode, findStrategy, parseCSS} from './helpers'
import {setAttribute, setProperty, dispatchEvent, addEventListener} from './scripts'

export class ElementSync {
  id: string = null
  query: Locator = null
  selector: string = null
  sessionId: string = null
  private webdriver: Webdriver = null
  constructor(selector: any, public browser: BrowserSync, parent?: string | ElementSync, id?: string) {
    this.webdriver = browser.webdriver
    this.sessionId = browser.sessionId
    const self = this
    if (id) {
      this.id = id
      _findStrategy(selector)
    }
    else if (!selector) {
      this.id = Sync.wait(this.webdriver.getActiveElement({ sessionId: this.sessionId })).value.ELEMENT
    }
    else if (typeof selector !== 'string') {
      throw new TypeError('selector must be: NULL or string of css selector')
    }
    else if (parent) {
      if (parent instanceof ElementSync) {
        this.id = Sync.wait(this.webdriver.findChildElement(
          Object.assign({ sessionId: this.sessionId, id: parent.id }, _findStrategy(selector))
        )).value.ELEMENT
      }
      else {
        let em = Sync.wait(this.webdriver.findElement(
          Object.assign({ sessionId: this.sessionId }, findStrategy(parent))
        )).value.ELEMENT
        this.id = Sync.wait(this.webdriver.findChildElement(
          Object.assign({ sessionId: this.sessionId, id: em.id }, _findStrategy(selector))
        )).value.ELEMENT
      }
    }
    else {
      this.id = Sync.wait(this.webdriver.findElement(
        Object.assign({ sessionId: this.sessionId }, _findStrategy(selector))
      )).value.ELEMENT
    }
    function _findStrategy(selector) {
      self.selector = selector
      return self.query = findStrategy(selector)
    }
  }

  get ELEMENT(): string {
    return this.id
  }

  click() {
    Sync.wait(this.webdriver.clickElement({ sessionId: this.sessionId, id: this.ELEMENT }))
  }
  clear() {
    Sync.wait(this.webdriver.clearElement({ sessionId: this.sessionId, id: this.ELEMENT }))
  }
  submit() {
    Sync.wait(this.webdriver.submitElement({ sessionId: this.sessionId, id: this.ELEMENT }))
  }
  keys(keys: string | string[], submit?: boolean) {
    const k = [].concat(keys)
    let value = []
    for (let charSet of k) {
      value = value.concat(checkUnicode(charSet))
    }
    Sync.wait(this.webdriver.typeElement({ sessionId: this.sessionId, id: this.ELEMENT, value }))
    if (submit) this.submit()
  }
  text(): string {
    return Sync.wait(this.webdriver.getElementText({ sessionId: this.sessionId, id: this.ELEMENT })).value
  }
  hasText(text: string | RegExp) {
    const em = this.text()
    if (text instanceof RegExp) return text.test(em)
    else return em.indexOf(text) >= 0
  }
  name(): string {
    return Sync.wait(this.webdriver.getElementTagName({ sessionId: this.sessionId, id: this.ELEMENT })).value
  }
  attr(name: string, value?: any) {
    if (value !== undefined) {
      return this.browser.execute(setAttribute, {
        using: this.query.using,
        value: this.query.value
      }, name, value)
    }
    return Sync.wait(this.webdriver.getElementAttribute({ sessionId: this.sessionId, id: this.ELEMENT, name })).value
  }
  css(propertyName: string): parsedCss {
    let res = Sync.wait(this.webdriver.getElementCssProperty({ sessionId: this.sessionId, id: this.ELEMENT, propertyName }))
    return parseCSS([res], propertyName)
  }
  size(): ElementSize {
    return Sync.wait(this.webdriver.getElementSize({ sessionId: this.sessionId, id: this.ELEMENT })).value
  }
  location(): ElementLocation {
    return Sync.wait(this.webdriver.getElementLocation({ sessionId: this.sessionId, id: this.ELEMENT })).value
  }
  locationInView(): ElementLocation {
    return Sync.wait(this.webdriver.getElementLocationInView({ sessionId: this.sessionId, id: this.ELEMENT })).value
  }
  isSelected(): boolean {
    return Sync.wait(this.webdriver.isElementSelected({ sessionId: this.sessionId, id: this.ELEMENT })).value
  }
  isEnabled(): boolean {
    return Sync.wait(this.webdriver.isElementEnabled({ sessionId: this.sessionId, id: this.ELEMENT })).value
  }
  isReadonly(): boolean {
    return !!(this.attr('readonly'))
  }
  isVisible(): boolean {
    return Sync.wait(this.webdriver.isElementDysplayed({ sessionId: this.sessionId, id: this.ELEMENT })).value
  }
  isEqual(em: string | ElementSync): boolean {
    let other = null
    if (typeof em === 'string') {
      em = new ElementSync(em, this.browser)
    }
    if (em instanceof ElementSync) {
      other = em.ELEMENT
    }
    return Sync.wait(this.webdriver.isElementEqual({ sessionId: this.sessionId, id: this.ELEMENT, other })).value
  }
  is(): boolean {
    try {
      Sync.wait(this.webdriver.getElementTagName({ sessionId: this.sessionId, id: this.ELEMENT }))
    }
    catch (e) {
      if (e.status == 10) return false
      throw e
    }
    return true
  }
  prop(name: string, value?: any) {
    return this.browser.execute(setProperty, {
      using: this.query.using,
      value: this.query.value
    }, name, value)
  }
  val(value?: any): string {
    return this.attr('value', value)
  }
  type(keys: any, submit?: boolean) {
    this.clear()
    this.keys(keys, submit)
  }
  select(options: any) {
    if (!Array.isArray(options)) {
      options = [options]
    }
    else if (options.length == 1 && typeof options[0] === 'number') {
      options = [options]
    }
    this.click()
    if (this.attr('multiple')) {
      this.browser.keys(['Control'])
      this.click()
      this.browser.keys(['Control'])
    }
    let ems: ElementSync[] = null
    for (let option of options) {
      let em: ElementSync = null
      if (Array.isArray(option)) {
        let n = option[0]
        if (ems === null) ems = this.browser.elements('option', this)
        if (n < ems.length && n >= 0) {
          em = ems[n]
        }
        else throw new TypeError('select option number incorrect index')
      }
      else if (typeof option === 'string' && option.startsWith('*=')) {
        em = this.browser.element('option*=' + option.slice(2), this)
      }
      else if (typeof option === 'string' && option.startsWith('=')) {
        em = this.browser.element('option=' + option.slice(1), this)
      }
      else {
        em = this.browser.element(`option[value="${option}"]`, this)
      }
      em.click()
    }
  }
  check() {
    if (!(this.attr('checked'))) {
      this.click()
      return true
    }
    return false
  }
  uncheck() {
    if (this.attr('checked')) {
      this.click()
      return true
    }
    return false
  }
  event(type: string, options?: any) {
    return this.browser.execute(dispatchEvent, {
      using: this.query.using,
      value: this.query.value
    }, type, options)
  }
  on(type: string) {
    return this.browser.executeAsync(addEventListener, {
      using: this.query.using,
      value: this.query.value
    }, type)
  }
}

export interface Locator {
  using: 'name' | 'id' | 'xpath' | 'class name' | 'css selector' | 'tag name' | 'link text' | 'partial link text'
  value: string
}

export interface parsedCss {
  property: string
  value: any
  parsed: any
}

export interface ElementSize {
  width: number
  height: number
}

export interface ElementLocation {
  x: number
  y: number
}
