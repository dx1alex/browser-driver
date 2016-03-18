"use strict";
const browser_1 = require('./browser');
const sync_plus_1 = require('sync-plus');
class BrowserSync extends browser_1.Browser {
    constructor(options) {
        super(options);
        this.$_ = {};
        this.$$_ = [];
        sync_plus_1.Sync.makePromise(this, {
            exclude: ['setDefaultTimeouts', 'element', 'elements', '$', '$$']
        });
    }
    element(selector, from) {
        let em = super.element(selector, from);
        return sync_plus_1.Sync.makePromise(em);
    }
    $(selector, from) {
        return this.$_ = this.element(selector, from);
    }
    elements(selector, from) {
        let ems = sync_plus_1.Sync.wait(super.elements(selector, from));
        for (let em of ems) {
            sync_plus_1.Sync.makePromise(em);
        }
        return ems;
    }
    $$(selector, from) {
        return this.$$_ = this.elements(selector, from);
    }
}
exports.BrowserSync = BrowserSync;
