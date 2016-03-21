import Webdriver from 'webdriver-wire-protocol'
import {Browser} from './browser'
import {checkUnicode, findStrategy, parseCSS} from './helpers'
import {setAttribute, setProperty, dispatchEvent, addEventListener} from './scripts'

export class Element {
  id: string = null
  query: Locator = null
  selector: string = null
  sessionId: string = null

  private _promiseELEMENT: Promise<any> = null
  private webdriver: Webdriver = null

  constructor(selector: any, public browser: Browser, from?: string | Element, id?: string) {
    this.webdriver = browser.webdriver
    this.sessionId = browser.sessionId
    const self = this
    if (id) {
      _findStrategy(selector)
      this._promiseELEMENT = Promise.resolve({ value: { ELEMENT: id } })
    }
    else if (!selector) {
      this._promiseELEMENT = this.webdriver.getActiveElement({ sessionId: this.sessionId })
    }
    else if (typeof selector !== 'string') {
      throw new TypeError('selector must be: NULL or string of css selector')
    }
    else if (from) {
      if (from instanceof Element) {
        this._promiseELEMENT = from.ELEMENT.then(res => {
          return this.webdriver.findChildElement(Object.assign({ sessionId: this.sessionId, id: res }, _findStrategy(selector)))
        })
      }
      else {
        this._promiseELEMENT = this.webdriver.findElement(Object.assign({ sessionId: this.sessionId }, findStrategy(from)))
          .then(res => {
            return res
          })
          .then(res => {
            return this.webdriver.findChildElement(Object.assign({ sessionId: this.sessionId, id: res.value.ELEMENT }
              , _findStrategy(selector)))
          })
      }
    }
    else {
      this._promiseELEMENT = this.webdriver.findElement(Object.assign({ sessionId: this.sessionId }, _findStrategy(selector)))
    }
    this._promiseELEMENT.catch(_throw)
    // TODO check throw
    function _throw(err) {
      throw err
    }
    function _findStrategy(selector) {
      self.selector = selector
      return self.query = findStrategy(selector)
    }
    return new Proxy(this, {
      get: (self, name) => {
        if (typeof this[name] === 'function' && name != 'ELEMENT' && this.browser.pause > 0) {
          return (...args) => {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(this[name](...args))
              }, this.browser.pause)
            })
          }
        }
        return this[name]
      }
    })
  }

  get ELEMENT(): Promise<string> {
    if (this.id !== null) return Promise.resolve(this.id)
    return this._promiseELEMENT.then(res => this.id = res.value.ELEMENT)
  }

  async click(wait?: number) {
    await this.webdriver.clickElement({ sessionId: this.sessionId, id: await this.ELEMENT })
    if (wait) return this.browser.executeAsync((wait, done) => setTimeout(() => done(window.location.href), wait), wait)
  }
  async clear() {
    await this.webdriver.clearElement({ sessionId: this.sessionId, id: await this.ELEMENT })
  }
  async submit() {
    await this.webdriver.submitElement({ sessionId: this.sessionId, id: await this.ELEMENT })
  }
  async keys(keys: string | string[], submit?: boolean) {
    const k = [].concat(keys)
    let value = []
    for (let charSet of k) {
      value = value.concat(checkUnicode(charSet))
    }
    await this.webdriver.typeElement({ sessionId: this.sessionId, id: await this.ELEMENT, value })
    if (submit) await this.submit()
  }
  async text(): Promise<string> {
    return this.webdriver.getElementText({ sessionId: this.sessionId, id: await this.ELEMENT })
      .then(res => res.value)
  }
  async hasText(text: string | RegExp) {
    const em = await this.text()
    if (text instanceof RegExp) return text.test(em)
    else return em.indexOf(text) >= 0
  }
  async name(): Promise<string> {
    return this.webdriver.getElementTagName({ sessionId: this.sessionId, id: await this.ELEMENT })
      .then(res => res.value)
  }
  async attr(name: string, value?: any) {
    if (value !== undefined) {
      return this.browser.execute(setAttribute, {
        using: this.query.using,
        value: this.query.value
      }, name, value)
        .then(res => res.value)
    }
    return this.webdriver.getElementAttribute({ sessionId: this.sessionId, id: await this.ELEMENT, name })
      .then(res => res.value)
  }
  async css(propertyName: string): Promise<parsedCss> {
    return this.webdriver.getElementCssProperty({ sessionId: this.sessionId, id: await this.ELEMENT, propertyName })
      .then(res => parseCSS([res], propertyName))
  }
  async size(): Promise<ElementSize> {
    return this.webdriver.getElementSize({ sessionId: this.sessionId, id: await this.ELEMENT })
      .then(res => res.value)
  }
  async location(): Promise<ElementLocation> {
    return this.webdriver.getElementLocation({ sessionId: this.sessionId, id: await this.ELEMENT })
      .then(res => res.value)
  }
  async locationInView(): Promise<ElementLocation> {
    return this.webdriver.getElementLocationInView({ sessionId: this.sessionId, id: await this.ELEMENT })
      .then(res => res.value)
  }
  async isSelected(): Promise<boolean> {
    return this.webdriver.isElementSelected({ sessionId: this.sessionId, id: await this.ELEMENT })
      .then(res => res.value)
  }
  async isEnabled(): Promise<boolean> {
    return this.webdriver.isElementEnabled({ sessionId: this.sessionId, id: await this.ELEMENT })
      .then(res => res.value)
  }
  async isReadonly(): Promise<boolean> {
    return !!(await this.attr('readonly'))
  }
  async isVisible(): Promise<boolean> {
    return this.webdriver.isElementDysplayed({ sessionId: this.sessionId, id: await this.ELEMENT })
      .then(res => res.value)
  }
  async isEqual(em: string | Element): Promise<boolean> {
    let other = null
    if (typeof em === 'string') {
      em = new Element(em, this.browser)
    }
    if (em instanceof Element) {
      other = await em.ELEMENT
    }
    return this.webdriver.isElementEqual({ sessionId: this.sessionId, id: await this.ELEMENT, other })
      .then(res => res.value)
  }
  async is(): Promise<boolean> {
    return this.webdriver.getElementTagName({ sessionId: this.sessionId, id: await this.ELEMENT })
      .then(res => true)
      .catch(res => {
        if (res.status == 10) return false
        throw res
      })
  }
  prop(name: string, value?: any): Promise<any> {
    return this.browser.execute(setProperty, {
      using: this.query.using,
      value: this.query.value
    }, name, value)
  }
  val(value?: any): Promise<string> {
    return this.attr('value', value)
  }
  async type(keys: any, submit?: boolean) {
    await this.clear()
    await this.keys(keys, submit)
  }
  async select(options: any) {
    if (!Array.isArray(options)) {
      options = [options]
    }
    else if (options.length == 1 && typeof options[0] === 'number') {
      options = [options]
    }
    await this.click()
    if (await this.attr('multiple')) {
      await this.browser.keys(['Control'])
      await this.click()
      await this.browser.keys(['Control'])
    }
    let ems: Element[] = null
    for (let option of options) {
      let em: Element = null
      if (Array.isArray(option)) {
        let n = option[0]
        if (ems === null) ems = await this.browser.elements('option', this)
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
      await em.click()
    }
  }
  async check() {
    if (!(await this.attr('checked'))) {
      await this.click()
      return true
    }
    return false
  }
  async uncheck() {
    if (await this.attr('checked')) {
      await this.click()
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

  // TODO:
  // isVisibleInView(){}
}

// TODO:
// arrow select option

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
