"use strict";
const element_1 = require('./element');
const sync_plus_1 = require('sync-plus');
class ElementSync extends element_1.Element {
    constructor(selector, browser, from, id) {
        super(selector, browser, from, id);
        sync_plus_1.Sync.makePromise(this);
    }
}
exports.ElementSync = ElementSync;
