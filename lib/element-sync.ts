import {Browser} from './browser'
import {Element} from './element'
import {Sync} from 'sync-plus'

export class ElementSync extends Element {
  constructor(selector: any, browser: Browser, from?: string | Element, id?: string) {
    super(selector, browser, from, id)
    Sync.makePromise(this)
  }
}
