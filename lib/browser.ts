import Webdriver from 'webdriver-wire-protocol'
import {Element} from './element'
import {checkUnicode, findStrategy} from './helpers'
import {addField, scroll} from './scripts'

const KEYS = [
  "NULL", "Cancel", "Help", "Back_space", "Tab", "Clear", "Return", "Enter", "Shift", "Control", "Alt", "Meta",
  "Pause", "Escape", "Semicolon", "Equals", "Insert", "Delete", "Space",
  "Pageup", "Pagedown", "End", "Home", "Left_arrow", "Up_arrow", "Right_arrow", "Down_arrow",
  "Numpad_0", "Numpad_1", "Numpad_2", "Numpad_3", "Numpad_4", "Numpad_5", "Numpad_6", "Numpad_7", "Numpad_8", "Numpad_9",
  "Multiply", "Add", "Separator", "Subtract", "Decimal", "Divide",
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"
]

export class Browser {
  gm = null
  anticaptcha = null

  key = {} as BrowserKeys
  sessionId: string = null
  capabilities: any = null
  webdriver: Webdriver = null
  defaults = {
    timeouts: {
      script: 30 * 1000,
      implicit: 500,
      page_load: 30 * 1000
    }
  }
  pause: number = 0
  $_: Element = <Element>{}
  $$_: Element[] = <Element[]>[]

  constructor(public options: any) {
    this.webdriver = new Webdriver(this.options.init)
    this.anticaptcha = this.options.init.anticaptcha
    this.gm = this.options.init.gm
    for (let k of KEYS) this.key[k] = async (k) => this.keys(k.replace('_', ' '))
  }

  async start(options?: any): Promise<string> {
    if (this.sessionId !== null) throw new Error('Session is open')
    options = options || this.options
    if (options.proxy) {
      this.options.desiredCapabilities.proxy = {
        proxyType: 'manual',
        httpProxy: options.proxy,
        sslProxy: options.proxy,
      }
    }
    const res = await this.webdriver.initSession(this.options)
    this.sessionId = res.sessionId
    this.capabilities = res.value
    await this.setTimeouts(this.defaults.timeouts)
    if (options.maximize) {
      await this.maximize()
    }
    else {
      if (options.size) await this.setSize(options.size[0], options.size[1])
      if (options.position) await this.setPosition(options.position[0], options.position[1])
    }
    if (options.url) {
      await this.url(options.url)
    }
    return this.sessionId
  }
  getStatus() {
    return this.webdriver.getStatus()
      .then(res => res.value)
  }
  async quit() {
    await this.webdriver.quit({ sessionId: this.sessionId })
    this.capabilities = null
    this.sessionId = null
    this.$_ = null
    this.$$_ = null
  }
  setDefaultTimeouts(options: Timeouts): void {
    if ('script' in options) this.defaults.timeouts.script = options.script
    if ('implicit' in options) this.defaults.timeouts.implicit = options.implicit
    if ('page_load' in options) this.defaults.timeouts.page_load = options.page_load
  }
  async setTimeouts(options?: Timeouts | 'script' | 'implicit' | 'page load', ms?: number) {
    if (typeof options === 'string') {
      await this.webdriver.setTimeout({
        sessionId: this.sessionId,
        type: options, ms: ms || this.defaults.timeouts[options.replace(' ', '_')]
      })
    }
    else if (options && typeof options === 'object') {
      if ('script' in options) await this.setTimeouts('script', options.script)
      if ('implicit' in options) await this.setTimeouts('implicit', options.implicit)
      if ('page_load' in options) await this.setTimeouts('page load', options.page_load)
    }
    else {
      await this.setTimeouts('script')
      await this.setTimeouts('implicit')
      await this.setTimeouts('page load')
    }
  }
  async setScriptTimeout(ms: number) {
    await this.webdriver.setScriptTimeout({ sessionId: this.sessionId, ms })
  }
  async setImplicitWait(ms: number) {
    await this.webdriver.setImplicitWait({ sessionId: this.sessionId, ms })
  }
  async setPageLoad(ms: number) {
    await this.webdriver.setTimeout({ sessionId: this.sessionId, type: 'page load', ms })
  }
  getTab(): Promise<string> {
    return this.webdriver.getWindow({ sessionId: this.sessionId })
      .then(res => res.value)
  }
  getTabs(): Promise<string[]> {
    return this.webdriver.getWindows({ sessionId: this.sessionId })
      .then(res => res.value)
  }
  async switchTab(name: string) {
    await this.webdriver.switchToWindow({ sessionId: this.sessionId, name })
  }
  async setPosition(windowHandle: any, x: number, y?: number) {
    if (typeof windowHandle === 'number') {
      y = x; x = windowHandle; windowHandle = 'current'
    }
    await this.webdriver.setWindowPosition({ sessionId: this.sessionId, windowHandle, x, y })
  }
  getPosition(windowHandle?: string): Promise<TabPosition> {
    return this.webdriver.getWindowPosition({ sessionId: this.sessionId, windowHandle: windowHandle || 'current' })
      .then(res => res.value)
  }
  async setSize(windowHandle: any, width: number, height?: number) {
    if (typeof windowHandle === 'number') {
      height = width; width = windowHandle; windowHandle = 'current'
    }
    await this.webdriver.setWindowSize({ sessionId: this.sessionId, windowHandle, width, height })
  }
  getSize(windowHandle?: string): Promise<TabSize> {
    return this.webdriver.getWindowSize({ sessionId: this.sessionId, windowHandle: windowHandle || 'current' })
      .then(res => res.value)
  }
  getViewSize(): Promise<TabSize> {
    return this.execute(function() {
      return {
        screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        screenHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      }
    })
      .then(res => {
        return {
          width: res.screenWidth || 0,
          height: res.screenHeight || 0
        }
      })
  }
  async maximize(windowHandle?: string) {
    await this.webdriver.maximizeWindow({ sessionId: this.sessionId, windowHandle: windowHandle || 'current' })
  }
  async close(name?: string) {
    if (name) {
      const tab = await this.getTab()
      if (name !== tab) {
        await this.switchTab(name)
        await this.close()
        await this.switchTab(tab)
      }
    }
    else await this.webdriver.closeWindow({ sessionId: this.sessionId })
  }
  async url(url?: string): Promise<string> {
    if (url) {
      await this.webdriver.openUrl({ sessionId: this.sessionId, url })
    }
    return this.webdriver.getUrl({ sessionId: this.sessionId })
      .then(res => res.value)
  }
  async get(url: string) {
    await this.webdriver.openUrl({ sessionId: this.sessionId, url })
  }
  async refresh() {
    await this.webdriver.refresh({ sessionId: this.sessionId })
  }
  async back() {
    await this.webdriver.goBack({ sessionId: this.sessionId })
  }
  async forward() {
    await this.webdriver.goForward({ sessionId: this.sessionId })
  }
  html(): Promise<string> {
    return this.webdriver.getSource({ sessionId: this.sessionId })
      .then(res => res.value)
  }
  title(): Promise<string> {
    return this.webdriver.getTitle({ sessionId: this.sessionId })
      .then(res => res.value)
  }
  async setCookie(cookie: Cookie) {
    await this.webdriver.setCookie({ sessionId: this.sessionId, cookie })
  }
  getCookies(): Promise<Cookie> {
    return this.webdriver.getCookies({ sessionId: this.sessionId })
      .then(res => res.value)
  }
  async deleteCookie(name?: string) {
    await this.webdriver.deleteCookie({ sessionId: this.sessionId, name })
  }
  async deleteAllCookies() {
    await this.webdriver.deleteAllCookies({ sessionId: this.sessionId })
  }
  async setPrompt(text: string) {
    await this.webdriver.setAlertPrompt({ sessionId: this.sessionId, text })
  }
  getDialog(): Promise<string> {
    return this.webdriver.getAlertMessage({ sessionId: this.sessionId })
      .then(res => res.value)
  }
  async acceptDialog() {
    await this.webdriver.acceptAlert({ sessionId: this.sessionId })
  }
  async dismissDialog() {
    await this.webdriver.dismissAlert({ sessionId: this.sessionId })
  }
  async dialog(accept?: boolean, text?: string) {
    if (accept === undefined) return this.getDialog()
    if (text) await this.setPrompt(text)
    if (accept) await this.acceptDialog()
    else await this.dismissDialog()
  }
  async switchFrame(id?: any) {
    id = id || null
    if (id instanceof Element) {
      id = await id.ELEMENT
    }
    await this.webdriver.switchToFrame({ sessionId: this.sessionId, id })
  }
  async switchParentFrame() {
    await this.webdriver.switchToParentFrame({ sessionId: this.sessionId })
  }
  async keys(keys: string | string[], ...more: string[]) {
    const k = [].concat(keys, more)
    let value = []
    for (let charSet of k) {
      value = value.concat(checkUnicode(charSet))
    }
    await this.webdriver.type({ sessionId: this.sessionId, value })
  }
  async capture(path: string, crop?: any, offset?: any): Promise<any> {
    if (typeof crop === 'string' || crop instanceof Element) {
      const em = this.element(crop)
      const size = await em.size()
      const location = await em.locationInView()
      offset = offset || {}
      return this.capture(path, {
        x: location.x + (offset.x || 0),
        y: location.y + (offset.y || 0),
        width: size.width + (offset.width || 0),
        height: size.height + (offset.height || 0)
      })
    }
    const base64: string = await this.webdriver.screenshot({ sessionId: this.sessionId }).then(res => res.value)
    if (path === 'buffer' && !crop) return new Buffer(base64, 'base64')
    if (path === 'base64' && !crop) return base64
    if (path === 'dataUri' && !crop) return 'data:image/png;base64,' + base64
    return new Promise((resolve, reject) => {
      const buffer = new Buffer(base64, 'base64')
      const img = this.gm(buffer, 'img.png').size((err, info) => {
        if (err) throw err
        if (crop) {
          img.crop(crop.width || info.width, crop.height || info.height, crop.x || 0, crop.y || 0)
        }
        if (path === 'base64' || path === 'dataUri' || path === 'buffer') {
          img.toBuffer('PNG', (err, buf) => {
            if (err) throw err
            if (path === 'buffer') resolve(buf)
            if (path === 'base64') resolve(buf.toString('base64'))
            if (path === 'dataUri') resolve('data:image/png;base64,' + buf.toString('base64'))
          })
        }
        else {
          img.write(path, err => {
            if (err) throw err
            resolve()
          })
        }
      })
    })
  }
  async captcha(selector: string | Element, crop: string | Element, options?) {
    const em = this.element(selector)
    const img = require('os').tmpdir() + `/captcha_${Math.random().toString(16).substr(2)}.png`
    await this.capture(img, crop)
    const res = await this.anticaptcha.recognize(img, options)
    await em.keys(res.code.trim())
    return res
  }
  execute(script: string | Function, ...args) {
    script = typeof script === 'function' ? `return (${script}).apply(null, arguments)` : script
    return this.webdriver.executeScript({ sessionId: this.sessionId, script, args })
      .then(res => res.value)
  }
  executeAsync(script: string | Function, ...args) {
    script = typeof script === 'function' ? `return (${script}).apply(null, arguments)` : script
    return this.webdriver.executeAsyncScript({ sessionId: this.sessionId, script, args })
      .then(res => res.value)
  }
  async mouseDoubleClick() {
    await this.webdriver.mouseDoubleClick({ sessionId: this.sessionId })
  }
  async mouseClick(button?: number) {
    button = button || 0
    await this.webdriver.mouseClick({ sessionId: this.sessionId, button })
  }
  async mouseUp(button?: number) {
    button = button || 0
    await this.webdriver.mouseUp({ sessionId: this.sessionId, button })
  }
  async mouseDown(button?: number) {
    button = button || 0
    await this.webdriver.mouseDown({ sessionId: this.sessionId, button })
  }
  async mouseMove(element: any, xoffset: number, yoffset?: number) {
    xoffset = xoffset || 0
    yoffset = yoffset || 0
    if (typeof element === 'number') {
      yoffset = xoffset; xoffset = element; element = null
    }
    else if (element) {
      element = await this.element(element).ELEMENT
    }
    else {
      element = null
    }
    await this.webdriver.mouseMoveTo({ sessionId: this.sessionId, element, xoffset, yoffset })
  }
  async click(selector: string | Element, target?: string, bg?: boolean) {
    const em = this.element(selector)
    if (target) await em.attr('target', target)
    if (bg) await this.keys(['Control'])
    await em.click()
    if (bg) await this.keys(['Control'])
  }
  async scroll(selector: string | Element, align?: any, y?: number, x?: number) {
    y = y || 0; x = x || 0
    if (typeof align === 'number') {
      x = y; y = align; align = null
    }
    let loc: any = {}, size: any = {}
    if (selector) {
      const em = this.element(selector)
      loc = await em.location()
      size = await em.size()
    }
    if (align == 'center') {
      y += size.height ? size.height / 2 : 0
    }
    if (align == 'bottom') {
      y += size.height ? size.height : 0
    }
    y += (loc.y || 0)
    x += (loc.x || 0)
    return this.execute(scroll, x, y, selector ? (align || 'top') : false)
  }
  async isExists(selector: string, from?: string | Element) {
    return await this.elements(selector, from).then(res => res.length) > 0
  }
  async hasText(text: string | RegExp) {
    const body = await this.element('body').text()
    if (text instanceof RegExp) return text.test(body)
    else return body.indexOf(text) >= 0
  }
  async form(selector: string | Element, data: any, submit?: boolean, options?: FormOptions) {
    options = options || {}
    options.addFild = options.addFild || false
    options.setInvisible = options.setInvisible || false
    options.setDisabled = options.setDisabled || false
    options.pause = options.pause || 0
    let set = async (em, data) => {
      let isVisible = await em.isVisible()
      let isEnabled = await em.isEnabled()
      if (isVisible && isEnabled) {
        await em.type(data)
      }
      else if (options.setInvisible != isVisible && options.setDisabled != isEnabled) {
        await em.attr('value', data)
      }
    }
    let form = await this.element(selector)
    for (let name of Object.keys(data)) {
      if (options.pause) await new Promise(resolve => setTimeout(resolve, options.pause))
      let method = 'name'
      let id: string = null
      let ems: Element[] = null
      if (name.startsWith('$=')) {
        id = name.slice(2)
        method = 'selector'
      }
      else if (name.startsWith('*=')) {
        id = 'label*=' + name.slice(2)
        method = 'label'
      }
      else if (name.startsWith('=')) {
        id = 'label=' + name.slice(1)
        method = 'label'
      }
      if (method == 'label') {
        id = await this.element(id, form).attr('for')
        ems = [await this.element('#' + id)]
      }
      else if (method == 'selector') {
        ems = await this.elements(id, form)
      }
      else {
        ems = await this.elements(`[name="${name}"]`, form)
      }
      if (ems.length > 0) {
        let last = ems.length - 1
        let em = ems[last]
        let tag = await em.name()
        let type = await em.attr('type')
        if (tag === 'input') {
          if (type === 'checkbox') {
            if (data[name]) await em.check()
            else await em.uncheck()
          }
          else if (type === 'radio') {
            if (Array.isArray(data[name])) {
              let n = data[name][0]
              if (n >= 0 && n <= last) {
                em = ems[n]
                await em.check()
              }
              else throw new TypeError('radio number incorrect index')
            }
            else {
              em = await this.element(`input[type="radio"][value="${data[name]}"]`, form)
              await em.check()
            }
          }
          else if (type === 'file') {
            await em.type(data[name])
          }
          else if (type === 'hidden') {
            console.log('hidden')
            await em.attr('value', data[name])
            console.log(await em.attr('value'))
          }
          else {
            await set(em, data[name])
          }
        }
        else if (tag === 'textarea') {
          await set(em, data[name])
        }
        else if (tag === 'select') {
          await em.select(data[name])
        }
      }
      else if (options.addFild) {
        let id = Math.random().toString(16).substr(2)
        await this.execute(addField, form.query, data[name], id)
      }
    }
    if (submit) {
      return form.submit()
    }
  }

  element(selector?: string | Element, from?: string | Element): Element {
    if (selector instanceof Element) {
      return selector
    }
    return new Element(selector || null, this, from)
  }
  $(selector?: string | Element, from?: string | Element): Element {
    return this.$_ = this.element(selector, from)
  }

  elements(selector: string, from?: string | Element): Promise<Element[]> {
    let _elements = (res) => {
      let elements: Element[] = []
      for (let id of res.value)
        elements.push(new Element(selector, this, null, id.ELEMENT))
      return elements
    }
    if (from) {
      if (from instanceof Element) {
        return from.ELEMENT.then(res => {
          return this.webdriver.findChildElements(Object.assign({ sessionId: this.sessionId, id: res }, findStrategy(selector)))
        })
          .then(_elements)
      }
      else if (typeof from === 'string') {
        return this.webdriver.findElement(Object.assign({ sessionId: this.sessionId }, findStrategy(from)))
          .then(res => {
            return this.webdriver.findChildElements(Object.assign({
              sessionId: this.sessionId, id: res.value.ELEMENT
            }, findStrategy(selector)))
          })
          .then(_elements)
      }
      else {
        throw new TypeError('child must be: object Element or string of css selector')
      }
    }
    return this.webdriver.findElements(Object.assign({ sessionId: this.sessionId }, findStrategy(selector)))
      .then(_elements)
  }
  async $$(selector: string, from?: string | Element): Promise<Element[]> {
    return this.$$_ = await this.elements(selector, from)
  }
}

// TODO:
// queue invoke methods
// name[]
// html5 input types
// array data in form
// switchTab by index
// tables
// keyPress()
// keyUp()
// keyDown()
// dragAndDrop()
// mouseScroll()
// table()

export interface ElementBuilder {
  (selector: string): Element
  (selector: Element): Element
  (selector: string, from: string): Element
  (selector: string, from: Element): Element
  (selector: Element, from: string): Element
  (selector: Element, from: Element): Element
  (): Element
}

export interface TabPosition {
  x: number
  y: number
}

export interface TabSize {
  width: number
  height: number
}

export interface Cookie {
  name: string        // The name of the cookie.
  value: string	      // The cookie value.
  path?: string       // (Optional) The cookie path.1
  domain?: string	    // (Optional) The domain the cookie is visible to.1
  secure?: boolean    // (Optional) Whether the cookie is a secure cookie.1
  httpOnly?: boolean  // (Optional) Whether the cookie is an httpOnly cookie.1
  expiry?: number     // (Optional) When the cookie expires, specified in seconds since midnight, January 1, 1970 UTC
}

export interface FormOptions {
  addFild?: boolean,
  setDisabled?: boolean,
  setInvisible?: boolean
  pause?: number
}

export interface Timeouts {
  script?: number,
  implicit?: number,
  page_load?: number
}

export interface BrowserKeys {
  NULL(): Promise<any>
  Cancel(): Promise<any>
  Help(): Promise<any>
  Back_space(): Promise<any>
  Tab(): Promise<any>
  Clear(): Promise<any>
  Return(): Promise<any>
  Enter(): Promise<any>
  Shift(): Promise<any>
  Control(): Promise<any>
  Alt(): Promise<any>
  Meta(): Promise<any>
  Pause(): Promise<any>
  Escape(): Promise<any>
  Semicolon(): Promise<any>
  Equals(): Promise<any>
  Insert(): Promise<any>
  Delete(): Promise<any>
  Space(): Promise<any>
  Pageup(): Promise<any>
  Pagedown(): Promise<any>
  End(): Promise<any>
  Home(): Promise<any>
  Left_arrow(): Promise<any>
  Up_arrow(): Promise<any>
  Right_arrow(): Promise<any>
  Down_arrow(): Promise<any>
  Numpad_0(): Promise<any>
  Numpad_1(): Promise<any>
  Numpad_2(): Promise<any>
  Numpad_3(): Promise<any>
  Numpad_4(): Promise<any>
  Numpad_5(): Promise<any>
  Numpad_6(): Promise<any>
  Numpad_7(): Promise<any>
  Numpad_8(): Promise<any>
  Numpad_9(): Promise<any>
  Multiply(): Promise<any>
  Add(): Promise<any>
  Separator(): Promise<any>
  Subtract(): Promise<any>
  Decimal(): Promise<any>
  Divide(): Promise<any>
  F1(): Promise<any>
  F2(): Promise<any>
  F3(): Promise<any>
  F4(): Promise<any>
  F5(): Promise<any>
  F6(): Promise<any>
  F7(): Promise<any>
  F8(): Promise<any>
  F9(): Promise<any>
  F10(): Promise<any>
  F11(): Promise<any>
  F12(): Promise<any>
}
