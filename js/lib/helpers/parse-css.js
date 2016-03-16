"use strict";
const css_value_1 = require('./css-value');
const rgb2hex_1 = require('./rgb2hex');
const sanitize_1 = require('./sanitize');
let parse = function (cssPropertyValue, cssProperty) {
    if (!cssPropertyValue || !cssPropertyValue.value) {
        return null;
    }
    let parsedValue = {
        property: cssProperty,
        value: cssPropertyValue.value.toLowerCase().trim()
    };
    if (parsedValue.value.indexOf('rgb') === 0) {
        parsedValue.value = parsedValue.value.replace(/\s/g, '');
        let color = parsedValue.value;
        parsedValue.parsed = rgb2hex_1.rgb2hex(parsedValue.value);
        parsedValue.parsed.type = 'color';
        parsedValue.parsed[/[rgba]+/g.exec(color)[0]] = color;
    }
    else if (parsedValue.property === 'font-family') {
        let font = css_value_1.cssParse(cssPropertyValue.value);
        let string = parsedValue.value;
        let value = cssPropertyValue.value.split(/,/).map(sanitize_1.css);
        parsedValue.value = sanitize_1.css(font[0].value || font[0].string);
        parsedValue.parsed = { value: value, type: 'font', string: string };
    }
    else {
        try {
            parsedValue.parsed = css_value_1.cssParse(cssPropertyValue.value);
            if (parsedValue.parsed.length === 1) {
                parsedValue.parsed = parsedValue.parsed[0];
            }
            if (parsedValue.parsed.type && parsedValue.parsed.type === 'number' && parsedValue.parsed.unit === '') {
                parsedValue.value = parsedValue.parsed.value;
            }
        }
        catch (e) {
        }
    }
    return parsedValue;
};
function parseCSS(response, cssProperty) {
    let parsedCSS = [];
    for (let res of response) {
        parsedCSS.push(parse(res, cssProperty));
    }
    if (parsedCSS.length === 1) {
        return parsedCSS[0];
    }
    else if (parsedCSS.length === 0) {
        return null;
    }
    return parsedCSS;
}
exports.parseCSS = parseCSS;
