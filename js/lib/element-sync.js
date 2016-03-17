"use strict";
const element_1 = require('./element');
const sync_promise_1 = require('./helpers/sync-promise');
class ElementSync extends element_1.Element {
    constructor(selector, browser, from, id) {
        super(selector, browser, from, id);
        Object.assign(ElementSync.prototype, sync_promise_1.syncPromise(this, this));
    }
}
exports.ElementSync = ElementSync;
