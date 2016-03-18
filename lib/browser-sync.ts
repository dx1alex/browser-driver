import {Browser} from './browser'
import {ElementSync} from './element-sync'
import {Sync} from 'sync-plus'

export class BrowserSync extends Browser {
  $_: ElementSync = <ElementSync>{}
  $$_: ElementSync[] = []
  constructor(options: any) {
    super(options)
    Sync.makePromise(this, {
      exclude: ['setDefaultTimeouts', 'element', 'elements', '$', '$$']
    })
  }
  element(selector?: string | ElementSync, from?: string | ElementSync): ElementSync {
    let em = super.element(selector, from)
    return Sync.makePromise(em)
  }
  $(selector?: string | ElementSync, from?: string | ElementSync): ElementSync {
    return this.$_ = this.element(selector, from)
  }
  elements(selector: string, from?: string | ElementSync): ElementSync[] {
    let ems: ElementSync[] = Sync.wait(super.elements(selector, from))
    for (let em of ems) {
      Sync.makePromise(em)
    }
    return ems
  }
  $$(selector: string, from?: string | ElementSync): ElementSync[] {
    return this.$$_ = this.elements(selector, from)
  }
}
