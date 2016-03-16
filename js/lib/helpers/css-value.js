"use strict";
function cssParse(str) {
    return new CssParser(str).parse();
}
exports.cssParse = cssParse;
class CssParser {
    constructor(str) {
        this.str = str;
    }
    skip(m) {
        this.str = this.str.slice(m[0].length);
    }
    comma() {
        let m = /^, */.exec(this.str);
        if (!m)
            return;
        this.skip(m);
        return {
            type: 'comma',
            string: ','
        };
    }
    ident() {
        let m = /^([\w-]+) */.exec(this.str);
        if (!m)
            return;
        this.skip(m);
        return {
            type: 'ident',
            string: m[1]
        };
    }
    int() {
        let m = /^((\d+)(\S+)?) */.exec(this.str);
        if (!m)
            return;
        this.skip(m);
        let n = ~~m[2];
        let u = m[3];
        return {
            type: 'number',
            string: m[1],
            unit: u || '',
            value: n
        };
    }
    float() {
        let m = /^(((?:\d+)?\.\d+)(\S+)?) */.exec(this.str);
        if (!m)
            return;
        this.skip(m);
        let n = parseFloat(m[2]);
        let u = m[3];
        return {
            type: 'number',
            string: m[1],
            unit: u || '',
            value: n
        };
    }
    number() {
        return this.float() || this.int();
    }
    double() {
        let m = /^"([^"]*)" */.exec(this.str);
        if (!m)
            return;
        this.skip(m);
        return {
            type: 'string',
            quote: '"',
            string: '"' + m[1] + '"',
            value: m[1]
        };
    }
    single() {
        let m = /^'([^']*)' */.exec(this.str);
        if (!m)
            return;
        this.skip(m);
        return {
            type: 'string',
            quote: "'",
            string: "'" + m[1] + "'",
            value: m[1]
        };
    }
    string() {
        return this.single() || this.double();
    }
    value() {
        return this.number()
            || this.ident()
            || this.string()
            || this.comma();
    }
    parse() {
        let vals = [];
        while (this.str.length) {
            let obj = this.value();
            if (!obj)
                throw new Error('failed to parse near `' + this.str.slice(0, 10) + '...`');
            vals.push(obj);
        }
        return vals;
    }
}
