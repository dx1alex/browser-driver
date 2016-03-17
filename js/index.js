"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./lib/browser'));
__export(require('./lib/chrome'));
__export(require('./lib/element'));
var browser_sync_1 = require('./lib/browser-sync');
exports.BrowserSync = browser_sync_1.BrowserSync;
var element_sync_1 = require('./lib/element-sync');
exports.ElementSync = element_sync_1.ElementSync;
