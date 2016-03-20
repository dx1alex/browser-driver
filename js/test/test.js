"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const index_1 = require('../index');
const bro = new index_1.Chrome({
    init: { url: 'http://localhost:9515' },
    desiredCapabilities: {
        browserName: 'chrome'
    }
});
bro.pause = 1000;
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield bro.start({ size: [1200, 800] });
            yield bro.url('http://google.com');
            console.log(yield bro.title());
            console.log(yield bro.$('a').attr('href'));
            yield bro.$('input[name="q"]').keys(['xxx', 'Return']);
            for (let em of yield bro.$$('#search h3 > a')) {
                console.log(yield em.attr('href'));
                if (yield em.isVisible())
                    yield em.click();
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
