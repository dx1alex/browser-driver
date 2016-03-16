"use strict";
const DEFAULT_SELECTOR = 'css selector';
function findStrategy(value, relative) {
    let xpathPrefix = relative ? './' : '//';
    let using = DEFAULT_SELECTOR;
    if (value.indexOf('#') === 0 && value.search(/(\s|>|\.|[|])/) === -1) {
        using = 'id';
        value = value.slice(1);
    }
    else if (value.indexOf('/') === 0 || value.indexOf('(') === 0 ||
        value.indexOf('../') === 0 || value.indexOf('./') === 0 ||
        value.indexOf('*/') === 0) {
        using = 'xpath';
    }
    else if (value.indexOf('=') === 0) {
        using = 'link text';
        value = value.slice(1);
    }
    else if (value.indexOf('*=') === 0) {
        using = 'partial link text';
        value = value.slice(2);
    }
    else if (value.indexOf('android=') === 0) {
        using = '-android uiautomator';
        value = value.slice(8);
    }
    else if (value.indexOf('ios=') === 0) {
        using = '-ios uiautomation';
        value = value.slice(4);
    }
    else if (value.indexOf('~') === 0) {
        using = 'accessibility id';
        value = value.slice(1);
    }
    else if (value.search(/<[a-zA-Z\-]+( \/)*>/g) >= 0) {
        using = 'tag name';
        value = value.replace(/<|>|\/|\s/g, '');
    }
    else if (value.search(/^\[name=("|')([a-zA-z0-9\-_ ]+)("|')\]$/) >= 0) {
        using = 'name';
        value = value.match(/^\[name=("|')([a-zA-z0-9\-_ ]+)("|')\]$/)[2];
    }
    else if (value.search(/^[a-z0-9]*=(.)+$/) >= 0) {
        let query = value.split(/=/);
        let tag = query.shift();
        using = 'xpath';
        value = `${xpathPrefix}${tag.length ? tag : '*'}[normalize-space() = "${query.join('=')}"]`;
    }
    else if (value.search(/^[a-z0-9]*\*=(.)+$/) >= 0) {
        let query = value.split(/\*=/);
        let tag = query.shift();
        using = 'xpath';
        value = `${xpathPrefix}${tag.length ? tag : '*'}[contains(., "${query.join('*=')}")]`;
    }
    else if (value.search(/^[a-z0-9]*(\.|#)-?[_a-zA-Z]+[_a-zA-Z0-9-]*=(.)+$/) >= 0) {
        let query = value.split(/=/);
        let tag = query.shift();
        let classOrId = tag.substr(tag.search(/(\.|#)/), 1) === '#' ? 'id' : 'class';
        let classOrIdName = tag.slice(tag.search(/(\.|#)/) + 1);
        tag = tag.substr(0, tag.search(/(\.|#)/));
        using = 'xpath';
        value = `${xpathPrefix}${tag.length ? tag : '*'}[contains(@${classOrId}, "${classOrIdName}") and normalize-space() = "${query.join('=')}"]`;
    }
    else if (value.search(/^[a-z0-9]*(\.|#)-?[_a-zA-Z]+[_a-zA-Z0-9-]*\*=(.)+$/) >= 0) {
        let query = value.split(/\*=/);
        let tag = query.shift();
        let classOrId = tag.substr(tag.search(/(\.|#)/), 1) === '#' ? 'id' : 'class';
        let classOrIdName = tag.slice(tag.search(/(\.|#)/) + 1);
        tag = tag.substr(0, tag.search(/(\.|#)/));
        using = 'xpath';
        value = xpathPrefix + (tag.length ? tag : '*') + '[contains(@' + classOrId + ', "' + classOrIdName + '") and contains(., "' + query.join('*=') + '")]';
        value = `${xpathPrefix}${tag.length ? tag : '*'}[contains(@${classOrId}, "${classOrIdName}") and contains(., "${query.join('*=')}")]`;
    }
    else if (value === '..' || value === '.') {
        using = 'xpath';
    }
    return {
        using: using,
        value: value
    };
}
exports.findStrategy = findStrategy;
