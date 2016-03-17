"use strict";
const browser_1 = require('./browser');
const sync_promise_1 = require('./helpers/sync-promise');
const sync_plus_1 = require('sync-plus');
class BrowserSync extends browser_1.Browser {
    constructor(options) {
        super(options);
        this.$_ = {};
        this.$$_ = [];
        Object.assign(BrowserSync.prototype, sync_promise_1.syncPromise(this, this, {
            exclude: ['setDefaultTimeouts', 'element', 'elements', '$', '$$']
        }));
    }
    element(selector, from) {
        let em = sync_plus_1.default.wait(super.element(selector, from));
        return sync_promise_1.syncPromise(em, em);
    }
    $(selector, from) {
        return this.$_ = this.element(selector, from);
    }
    elements(selector, from) {
        let ems = sync_plus_1.default.wait(super.elements(selector, from));
        let sems = [];
        for (let em of ems) {
            sems.push(sync_promise_1.syncPromise(em, em));
        }
        return sems;
    }
    $$(selector, from) {
        return this.$$_ = this.elements(selector, from);
    }
}
exports.BrowserSync = BrowserSync;
