import {Browser} from './browser'
import {ElementSync} from './element-sync'
import {syncPromise} from './helpers/sync-promise'
import Sync from 'sync-plus'

export class BrowserSync extends Browser {
  $_: ElementSync = <ElementSync>{}
  $$_: ElementSync[] = []
  constructor(options: any) {
    super(options)
    Object.assign(BrowserSync.prototype, syncPromise<BrowserSync>(this, this, {
      exclude: ['setDefaultTimeouts', 'element', 'elements', '$', '$$']
    }))
  }
  element(selector?: string | ElementSync, from?: string | ElementSync): ElementSync {
    let em = Sync.wait(super.element(selector, from))
    return syncPromise<ElementSync>(em, em)
  }
  $(selector?: string | ElementSync, from?: string | ElementSync): ElementSync {
    return this.$_ = this.element(selector, from)
  }
  elements(selector: string, from?: string | ElementSync): ElementSync[] {
    let ems: Element[] = Sync.wait(super.elements(selector, from))
    let sems: ElementSync[] = []
    for (let em of ems) {
      sems.push(syncPromise<ElementSync>(em, em))
    }
    return sems
  }
  $$(selector: string, from?: string | ElementSync): ElementSync[] {
    return this.$$_ = this.elements(selector, from)
  }
}
