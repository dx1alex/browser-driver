import {Browser} from './browser'
import {Element} from './element'
import {syncPromise} from './helpers/sync-promise'

export class ElementSync extends Element {
  constructor(selector: any, browser: Browser, from?: string | Element, id?: string) {
    super(selector, browser, from, id)
    Object.assign(ElementSync.prototype, syncPromise<ElementSync>(this, this))
  }
}
