import {ElementSync} from './element-sync'
import {Sync} from 'sync-plus'
import Webdriver from 'webdriver-wire-protocol'
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

export class BrowserSync {
  gm = null
  anticaptcha = null

  key = {} as BrowserKeys
  sessionId: string = null
  capabilities: any = null
  webdriver: Webdriver = null
  defaults = {
    timeouts: {
      script: 60 * 1000,
      implicit: 1000,
      page_load: 60 * 1000
    }
  }
  $_: ElementSync = <ElementSync>{}
  $$_: ElementSync[] = <ElementSync[]>[]

  constructor(public options: any) {
    this.webdriver = new Webdriver(this.options.init)
    this.anticaptcha = this.options.init.anticaptcha
    this.gm = this.options.init.gm
    for (let k of KEYS) this.key[k] = (k) => this.keys(k.replace('_', ' '))
  }

  start(options?: any): string {
    if (this.sessionId !== null) throw new Error('Session is open')
    options = options || this.options
    if (options.proxy) this.options.desiredCapabilities.proxy = options.proxy
    const res = Sync.wait(this.webdriver.initSession(this.options))
    this.sessionId = res.sessionId
    this.capabilities = res.value
    this.setTimeouts(this.defaults.timeouts)
    if (options.maximize) {
      this.maximize()
    }
    else {
      if (options.size) this.setSize(options.size[0], options.size[1])
      if (options.position) this.setPosition(options.position[0], options.position[1])
    }
    if (options.url) {
      this.url(options.url)
    }
    return this.sessionId
  }
  getStatus() {
    return Sync.wait(this.webdriver.getStatus()).value
  }
  quit() {
    Sync.wait(this.webdriver.quit({ sessionId: this.sessionId }))
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
  setTimeouts(options?: Timeouts | 'script' | 'implicit' | 'page load', ms?: number) {
    if (typeof options === 'string') {
      Sync.wait(this.webdriver.setTimeout({
        sessionId: this.sessionId,
        type: options, ms: ms || this.defaults.timeouts[options.replace(' ', '_')]
      }))
    }
    else if (options && typeof options === 'object') {
      if ('script' in options) this.setTimeouts('script', options.script)
      if ('implicit' in options) this.setTimeouts('implicit', options.implicit)
      if ('page_load' in options) this.setTimeouts('page load', options.page_load)
    }
    else {
      this.setTimeouts('script')
      this.setTimeouts('implicit')
      this.setTimeouts('page load')
    }
  }
  setScriptTimeout(ms: number) {
    Sync.wait(this.webdriver.setScriptTimeout({ sessionId: this.sessionId, ms }))
  }
  setImplicitWait(ms: number) {
    Sync.wait(this.webdriver.setImplicitWait({ sessionId: this.sessionId, ms }))
  }
  setPageLoad(ms: number) {
    Sync.wait(this.webdriver.setTimeout({ sessionId: this.sessionId, type: 'page load', ms }))
  }
  getTab(): string {
    return Sync.wait(this.webdriver.getWindow({ sessionId: this.sessionId })).value
  }
  getTabs(): string[] {
    return Sync.wait(this.webdriver.getWindows({ sessionId: this.sessionId })).value
  }
  switchTab(name: string) {
    Sync.wait(this.webdriver.switchToWindow({ sessionId: this.sessionId, name }))
  }
  setPosition(windowHandle: any, x: number, y?: number) {
    if (typeof windowHandle === 'number') {
      y = x; x = windowHandle; windowHandle = 'current'
    }
    Sync.wait(this.webdriver.setWindowPosition({ sessionId: this.sessionId, windowHandle, x, y }))
  }
  getPosition(windowHandle?: string): TabPosition {
    return Sync.wait(this.webdriver.getWindowPosition({
      sessionId: this.sessionId, windowHandle: windowHandle || 'current'
    })).value
  }
  setSize(windowHandle: any, width: number, height?: number) {
    if (typeof windowHandle === 'number') {
      height = width; width = windowHandle; windowHandle = 'current'
    }
    Sync.wait(this.webdriver.setWindowSize({ sessionId: this.sessionId, windowHandle, width, height }))
  }
  getSize(windowHandle?: string): TabSize {
    return Sync.wait(this.webdriver.getWindowSize({
      sessionId: this.sessionId, windowHandle: windowHandle || 'current'
    })).value
  }
  getViewSize(): TabSize {
    const res = this.execute(function() {
      return {
        screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        screenHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      }
    })
    return {
      width: res.screenWidth || 0,
      height: res.screenHeight || 0
    }
  }
  maximize(windowHandle?: string) {
    Sync.wait(this.webdriver.maximizeWindow({ sessionId: this.sessionId, windowHandle: windowHandle || 'current' }))
  }
  close(name?: string) {
    if (name) {
      const tab = this.getTab()
      if (name !== tab) {
        this.switchTab(name)
        this.close()
        this.switchTab(tab)
      }
    }
    else Sync.wait(this.webdriver.closeWindow({ sessionId: this.sessionId }))
  }
  url(url?: string): string {
    if (url) {
      Sync.wait(this.webdriver.openUrl({ sessionId: this.sessionId, url }))
    }
    return Sync.wait(this.webdriver.getUrl({ sessionId: this.sessionId })).value
  }
  get(url: string) {
    Sync.wait(this.webdriver.openUrl({ sessionId: this.sessionId, url }))
  }
  refresh() {
    Sync.wait(this.webdriver.refresh({ sessionId: this.sessionId }))
  }
  back() {
    Sync.wait(this.webdriver.goBack({ sessionId: this.sessionId }))
  }
  forward() {
    Sync.wait(this.webdriver.goForward({ sessionId: this.sessionId }))
  }
  html(): string {
    return Sync.wait(this.webdriver.getSource({ sessionId: this.sessionId })).value
  }
  title(): string {
    return Sync.wait(this.webdriver.getTitle({ sessionId: this.sessionId })).value
  }
  setCookie(cookie: Cookie) {
    Sync.wait(this.webdriver.setCookie({ sessionId: this.sessionId, cookie }))
  }
  getCookies(): Cookie {
    return Sync.wait(this.webdriver.getCookies({ sessionId: this.sessionId })).value
  }
  deleteCookie(name?: string) {
    Sync.wait(this.webdriver.deleteCookie({ sessionId: this.sessionId, name }))
  }
  deleteAllCookies() {
    Sync.wait(this.webdriver.deleteAllCookies({ sessionId: this.sessionId }))
  }
  setPrompt(text: string) {
    Sync.wait(this.webdriver.setAlertPrompt({ sessionId: this.sessionId, text }))
  }
  getDialog(): string {
    return Sync.wait(this.webdriver.getAlertMessage({ sessionId: this.sessionId })).value
  }
  acceptDialog() {
    Sync.wait(this.webdriver.acceptAlert({ sessionId: this.sessionId }))
  }
  dismissDialog() {
    Sync.wait(this.webdriver.dismissAlert({ sessionId: this.sessionId }))
  }
  dialog(accept?: boolean, text?: string) {
    if (accept === undefined) return this.getDialog()
    if (text) this.setPrompt(text)
    if (accept) this.acceptDialog()
    else this.dismissDialog()
  }
  switchFrame(id: any = null) {
    if (id instanceof ElementSync) {
      id = id.ELEMENT
    }
    Sync.wait(this.webdriver.switchToFrame({ sessionId: this.sessionId, id }))
  }
  switchParentFrame() {
    Sync.wait(this.webdriver.switchToParentFrame({ sessionId: this.sessionId }))
  }
  keys(keys: string | string[], ...more: string[]) {
    const k = [].concat(keys, more)
    let value = []
    for (let charSet of k) {
      value = value.concat(checkUnicode(charSet))
    }
    Sync.wait(this.webdriver.type({ sessionId: this.sessionId, value }))
  }
  capture(path: string, crop?: any, offset?: any) {
    if (typeof crop === 'string' || crop instanceof ElementSync) {
      const em = this.element(crop)
      const size = em.size()
      const location = em.locationInView()
      offset = offset || {}
      return this.capture(path, {
        x: location.x + (offset.x || 0),
        y: location.y + (offset.y || 0),
        width: size.width + (offset.width || 0),
        height: size.height + (offset.height || 0)
      })
    }
    const base64: string = Sync.wait(this.webdriver.screenshot({ sessionId: this.sessionId })).value
    if (path === 'buffer' && !crop) return new Buffer(base64, 'base64')
    if (path === 'base64' && !crop) return base64
    if (path === 'dataUri' && !crop) return 'data:image/png;base64,' + base64

    const buffer = new Buffer(base64, 'base64')
    return Sync.run(done => {
      const img = this.gm(buffer, 'img.png').size((err, info) => {
        if (err) throw err
        if (crop) {
          img.crop(crop.width || info.width, crop.height || info.height, crop.x || 0, crop.y || 0)
        }
        if (path === 'base64' || path === 'dataUri' || path === 'buffer') {
          img.toBuffer('PNG', (err, buf) => {
            if (err) throw err
            if (path === 'buffer') done(null, buf)
            if (path === 'base64') done(null, buf.toString('base64'))
            if (path === 'dataUri') done(null, 'data:image/png;base64,' + buf.toString('base64'))
          })
        }
        else {
          img.write(path, err => {
            if (err) throw err
            done()
          })
        }
      })
    })
  }
  captcha(selector: string | ElementSync, crop: string | ElementSync, options?) {
    const em = this.element(selector)
    const img = require('os').tmpdir() + `/captcha_${Math.random().toString(16).substr(2)}.png`
    this.capture(img, crop)
    const res = this.anticaptcha.recognize(img, options)
    em.keys(res.code.trim())
    return res
  }
  execute(script: string | Function, ...args) {
    script = typeof script === 'function' ? `return (${script}).apply(null, arguments)` : script
    return Sync.wait(this.webdriver.executeScript({ sessionId: this.sessionId, script, args })).value
  }
  executeAsync(script: string | Function, ...args) {
    script = typeof script === 'function' ? `return (${script}).apply(null, arguments)` : script
    return Sync.wait(this.webdriver.executeAsyncScript({ sessionId: this.sessionId, script, args })).value
  }
  mouseDoubleClick() {
    Sync.wait(this.webdriver.mouseDoubleClick({ sessionId: this.sessionId }))
  }
  mouseClick(button?: number) {
    button = button || 0
    Sync.wait(this.webdriver.mouseClick({ sessionId: this.sessionId, button }))
  }
  mouseUp(button?: number) {
    button = button || 0
    Sync.wait(this.webdriver.mouseUp({ sessionId: this.sessionId, button }))
  }
  mouseDown(button?: number) {
    button = button || 0
    Sync.wait(this.webdriver.mouseDown({ sessionId: this.sessionId, button }))
  }
  mouseMove(element: any, xoffset: number, yoffset?: number) {
    xoffset = xoffset || 0
    yoffset = yoffset || 0
    if (typeof element === 'number') {
      yoffset = xoffset; xoffset = element; element = null
    }
    else if (element) {
      element = this.element(element).ELEMENT
    }
    else {
      element = null
    }
    Sync.wait(this.webdriver.mouseMoveTo({ sessionId: this.sessionId, element, xoffset, yoffset }))
  }
  click(selector: string | ElementSync, target?: string, bg?: boolean) {
    const em = this.element(selector)
    if (target) em.attr('target', target)
    if (bg) this.keys(['Control'])
    em.click()
    if (bg) this.keys(['Control'])
  }
  scroll(selector: string | ElementSync, align?: any, y?: number, x?: number) {
    y = y || 0; x = x || 0
    if (typeof align === 'number') {
      x = y; y = align; align = null
    }
    let loc: any = {}, size: any = {}
    if (selector) {
      const em = this.element(selector)
      loc = em.location(); size = em.size()
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
  isExists(selector: string, parent?: string | ElementSync) {
    return this.elements(selector, parent).length > 0
  }
  hasText(text: string | RegExp) {
    const body = this.element('body').text()
    if (text instanceof RegExp) return text.test(body)
    else return body.indexOf(text) >= 0
  }
  form(selector: string | ElementSync, data: any, submit?: boolean, options?: FormOptions) {
    options = options || {}
    options.addFild = options.addFild || false
    options.setInvisible = options.setInvisible || false
    options.setDisabled = options.setDisabled || false
    options.pause = options.pause || 0
    let set = async (em, data) => {
      let isVisible = em.isVisible()
      let isEnabled = em.isEnabled()
      if (isVisible && isEnabled) {
        em.type(data)
      }
      else if (options.setInvisible != isVisible && options.setDisabled != isEnabled) {
        em.attr('value', data)
      }
    }
    let form = this.element(selector)
    for (let name of Object.keys(data)) {
      if (options.pause) Sync.sleep(options.pause)
      let method = 'name'
      let id: string = null
      let ems: ElementSync[] = null
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
        id = this.element(id, form).attr('for')
        ems = [this.element('#' + id)]
      }
      else if (method == 'selector') {
        ems = this.elements(id, form)
      }
      else {
        ems = this.elements(`[name="${name}"]`, form)
      }
      if (ems.length > 0) {
        let last = ems.length - 1
        let em = ems[last]
        let tag = em.name()
        let type = em.attr('type')
        if (tag === 'input') {
          if (type === 'checkbox') {
            if (data[name]) em.check()
            else em.uncheck()
          }
          else if (type === 'radio') {
            if (Array.isArray(data[name])) {
              let n = data[name][0]
              if (n >= 0 && n <= last) {
                em = ems[n]
                em.check()
              }
              else throw new TypeError('radio number incorrect index')
            }
            else {
              em = this.element(`input[type="radio"][value="${data[name]}"]`, form)
              em.check()
            }
          }
          else if (type === 'file') {
            em.type(data[name])
          }
          else if (type === 'hidden') {
            console.log('hidden')
            em.attr('value', data[name])
            console.log(em.attr('value'))
          }
          else {
            set(em, data[name])
          }
        }
        else if (tag === 'textarea') {
          set(em, data[name])
        }
        else if (tag === 'select') {
          em.select(data[name])
        }
      }
      else if (options.addFild) {
        let id = Math.random().toString(16).substr(2)
        this.execute(addField, form.query, data[name], id)
      }
    }
    if (submit) {
      return form.submit()
    }
  }

  element(selector?: string | ElementSync, parent?: string | ElementSync): ElementSync {
    if (selector instanceof ElementSync) {
      return selector
    }
    return new ElementSync(selector || null, this, parent)
  }
  $(selector?: string | ElementSync, parent?: string | ElementSync): ElementSync {
    return this.$_ = this.element(selector, parent)
  }

  elements(selector: string, parent?: string | ElementSync): ElementSync[] {
    let _elements = (ids: any[] = []) => {
      let elements: ElementSync[] = []
      for (let id of ids) {
        id = id.ELEMENT
        elements.push(new ElementSync(selector, this, null, id))
      }
      return elements
    }
    if (parent) {
      if (parent instanceof ElementSync) {
        return _elements(Sync.wait(this.webdriver.findChildElements(
          Object.assign({ sessionId: this.sessionId, id: parent.id }, findStrategy(selector))
        )).value)
      }
      else if (typeof parent === 'string') {
        let id = Sync.wait(this.webdriver.findElement(Object.assign({ sessionId: this.sessionId }, findStrategy(parent)))).value
        return _elements(Sync.wait(this.webdriver.findChildElements(
          Object.assign({
            sessionId: this.sessionId, id
          }, findStrategy(selector)
          )
        )).value)
      }
      else {
        throw new TypeError('child must be: object Element or string of css selector')
      }
    }
    return _elements(Sync.wait(this.webdriver.findElements(
      Object.assign({ sessionId: this.sessionId }, findStrategy(selector)))).value
    )
  }
  $$(selector: string, parent?: string | ElementSync): ElementSync[] {
    return this.$$_ = this.elements(selector, parent)
  }
}

export interface ElementBuilder {
  (selector: string): ElementSync
  (selector: ElementSync): ElementSync
  (selector: string, parent: string): ElementSync
  (selector: string, parent: ElementSync): ElementSync
  (selector: ElementSync, parent: string): ElementSync
  (selector: ElementSync, parent: ElementSync): ElementSync
  (): ElementSync
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
  NULL()
  Cancel()
  Help()
  Back_space()
  Tab()
  Clear()
  Return()
  Enter()
  Shift()
  Control()
  Alt()
  Meta()
  Pause()
  Escape()
  Semicolon()
  Equals()
  Insert()
  Delete()
  Space()
  Pageup()
  Pagedown()
  End()
  Home()
  Left_arrow()
  Up_arrow()
  Right_arrow()
  Down_arrow()
  Numpad_0()
  Numpad_1()
  Numpad_2()
  Numpad_3()
  Numpad_4()
  Numpad_5()
  Numpad_6()
  Numpad_7()
  Numpad_8()
  Numpad_9()
  Multiply()
  Add()
  Separator()
  Subtract()
  Decimal()
  Divide()
  F1()
  F2()
  F3()
  F4()
  F5()
  F6()
  F7()
  F8()
  F9()
  F10()
  F11()
  F12()
}


// export class BrowserSync extends Browser {
//   $_: ElementSync = <ElementSync>{}
//   $$_: ElementSync[] = []
//   constructor(options: any) {
//     super(options)
//     Sync.makePromise(this, {
//       exclude: ['setDefaultTimeouts', 'element', 'elements', '$', '$$']
//     })
//   }
//   element(selector?: string | ElementSync, from?: string | ElementSync): ElementSync {
//     let em = super.element(selector, from)
//     return Sync.makePromise(em)
//   }
//   $(selector?: string | ElementSync, from?: string | ElementSync): ElementSync {
//     return this.$_ = this.element(selector, from)
//   }
//   elements(selector: string, from?: string | ElementSync): ElementSync[] {
//     let ems: ElementSync[] = Sync.wait(super.elements(selector, from))
//     for (let em of ems) {
//       Sync.makePromise(em)
//     }
//     return ems
//   }
//   $$(selector: string, from?: string | ElementSync): ElementSync[] {
//     return this.$$_ = this.elements(selector, from)
//   }
// }
