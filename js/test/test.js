"use strict";
const _1 = require('../');
const bro = new _1.Browser({
    init: { url: 'http://localhost:9515' },
    desiredCapabilities: {
        browserName: 'chrome'
    }
});
bro.start().then(() => {
    bro.url('http://google.com');
});
