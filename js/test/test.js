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
    dir: '/tmp/test1',
    prefs: {
        profile: {
            content_settings: {
                exceptions: {
                    images: {
                        "https://vk.com:443,https://vk.com:443": {
                            setting: 1
                        }
                    }
                }
            },
            "default_content_setting_values": {
                "images": 2
            }
        }
    },
    init: { url: 'http://localhost:9515' },
    desiredCapabilities: {
        browserName: 'chrome'
    }
});
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let res = yield bro.start({ size: [1200, 800] });
            console.log(bro.capabilities);
            yield bro.url('http://google.com');
            console.log(yield bro.title());
            console.log(yield bro.$('a').attr('href'));
            yield bro.$('input[name="q"]').keys(['xxx', 'Return']);
            yield bro.newTab(true);
            yield bro.url('http://ya.ru');
            console.log(yield bro.newWindow(true));
            yield bro.url('http://ya.ru');
        }
        catch (e) {
            console.log(e);
        }
    });
}
