"use strict";
const sync_plus_1 = require('sync-plus');
function syncPromise(binding, obj, options = {}) {
    let bl = EXCLUDE_STD_LIST;
    let include = (m) => true;
    let exclude = (m) => bl.indexOf(m) < 0;
    if (Array.isArray(options.include)) {
        bl = bl.concat(options.include);
        include = (m) => bl.indexOf(m) >= 0;
    }
    if (Array.isArray(options.exclude)) {
        bl = bl.concat(options.exclude);
    }
    let methods = getAllPropertyNames(obj).filter(m => (typeof obj[m] == 'function' && include(m) && exclude(m)));
    const src = {};
    for (let m of methods) {
        src[m] = sync_plus_1.default.promise(binding ? obj[m].bind(binding) : obj[m]);
    }
    return src;
}
exports.syncPromise = syncPromise;
const EXCLUDE_STD_LIST = [
    'constructor', 'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    '__defineGetter__', '__lookupGetter__', '__defineSetter__', '__lookupSetter__', '__proto__'
];
function getAllPropertyNames(obj) {
    let props = [];
    do {
        for (let prop of Object.getOwnPropertyNames(obj)) {
            if (props.indexOf(prop) === -1) {
                props.push(prop);
            }
        }
    } while (obj = Object.getPrototypeOf(obj));
    return props;
}
