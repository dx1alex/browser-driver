"use strict";
const JsonRestBuilder_1 = require('./helpers/JsonRestBuilder');
const requesHandler_1 = require('./helpers/requesHandler');
class Webdriver {
    constructor(options) {
        new JsonRestBuilder_1.default({
            url: options.url,
            request: options.request || requesHandler_1.default
        })
            .get('getStatus', '/status')
            .post('initSession', '/session', ['desiredCapabilities'])
            .get('getSessions', '/sessions')
            .get('getSession', '/session/:sessionId')
            .delete('quit', '/session/:sessionId')
            .post('setTimeout', '/session/:sessionId/timeouts', ['type', 'ms'])
            .post('setScriptTimeout', '/session/:sessionId/timeouts/async_script', ['ms'])
            .post('setImplicitWait', '/session/:sessionId/timeouts/implicit_wait', ['ms'])
            .get('getWindow', '/session/:sessionId/window_handle')
            .get('getWindows', '/session/:sessionId/window_handles')
            .post('switchToWindow', '/session/:sessionId/window', ['name'])
            .delete('closeWindow', '/session/:sessionId/window')
            .post('setWindowSize', '/session/:sessionId/window/:windowHandle/size', ['width', 'height'])
            .get('getWindowSize', '/session/:sessionId/window/:windowHandle/size')
            .post('setWindowPosition', '/session/:sessionId/window/:windowHandle/position', ['x', 'y'])
            .get('getWindowPosition', '/session/:sessionId/window/:windowHandle/position')
            .post('maximizeWindow', '/session/:sessionId/window/:windowHandle/maximize')
            .get('getUrl', '/session/:sessionId/url')
            .post('openUrl', '/session/:sessionId/url', ['url'])
            .post('goForward', '/session/:sessionId/forward')
            .post('goBack', '/session/:sessionId/back')
            .post('refresh', '/session/:sessionId/refresh')
            .post('executeScript', '/session/:sessionId/execute', ['script', 'args'])
            .post('executeAsyncScript', '/session/:sessionId/execute_async', ['script', 'args'])
            .get('screenshot', '/session/:sessionId/screenshot')
            .get('getImeAvailableEngines', '/session/:sessionId/ime/available_engines')
            .get('getImeActiveEngine', '/session/:sessionId/ime/active_engine')
            .get('isImeActivated', '/session/:sessionId/ime/activated')
            .post('deactivateIme', '/session/:sessionId/ime/deactivate')
            .post('activateIme', '/session/:sessionId/ime/activate', ['engine'])
            .post('switchToFrame', '/session/:sessionId/frame', ['id'])
            .post('switchToParentFrame', '/session/:sessionId/frame/parent')
            .get('getCookies', '/session/:sessionId/cookie')
            .post('setCookie', '/session/:sessionId/cookie', ['cookie'])
            .delete('deleteAllCookies', '/session/:sessionId/cookie')
            .delete('deleteCookie', '/session/:sessionId/cookie/:name')
            .get('getSource', '/session/:sessionId/source')
            .get('getTitle', '/session/:sessionId/title')
            .post('findElement', '/session/:sessionId/element', ['using', 'value'])
            .post('findElements', '/session/:sessionId/elements', ['using', 'value'])
            .post('getActiveElement', '/session/:sessionId/element/active')
            .post('findChildElement', '/session/:sessionId/element/:id/element', ['using', 'value'])
            .post('findChildElements', '/session/:sessionId/element/:id/elements', ['using', 'value'])
            .post('type', '/session/:sessionId/keys', ['value'])
            .post('clickElement', '/session/:sessionId/element/:id/click')
            .post('clearElement', '/session/:sessionId/element/:id/clear')
            .post('submitElement', '/session/:sessionId/element/:id/submit')
            .get('getElementText', '/session/:sessionId/element/:id/text')
            .post('typeElement', '/session/:sessionId/element/:id/value', ['value'])
            .get('getElementTagName', '/session/:sessionId/element/:id/name')
            .get('isElementSelected', '/session/:sessionId/element/:id/selected')
            .get('isElementEnabled', '/session/:sessionId/element/:id/enabled')
            .get('getElementAttribute', '/session/:sessionId/element/:id/attribute/:name')
            .get('isElementEqual', '/session/:sessionId/element/:id/equals/:other')
            .get('isElementDysplayed', '/session/:sessionId/element/:id/displayed')
            .get('getElementLocation', '/session/:sessionId/element/:id/location')
            .get('getElementLocationInView', '/session/:sessionId/element/:id/location_in_view')
            .get('getElementSize', '/session/:sessionId/element/:id/size')
            .get('getElementCssProperty', '/session/:sessionId/element/:id/css/:propertyName')
            .get('getOrientation', '/session/:sessionId/orientation')
            .post('setOrientation', '/session/:sessionId/orientation', ['orientation'])
            .get('getAlertMessage', '/session/:sessionId/alert_text')
            .post('setAlertPrompt', '/session/:sessionId/alert_text', ['text'])
            .post('acceptAlert', '/session/:sessionId/accept_alert')
            .post('dismissAlert', '/session/:sessionId/dismiss_alert')
            .post('mouseMoveTo', '/session/:sessionId/moveto', ['element', 'xoffset', 'yoffset'])
            .post('mouseClick', '/session/:sessionId/click', ['button'])
            .post('mouseDoubleClick', '/session/:sessionId/doubleclick')
            .post('mouseDown', '/session/:sessionId/buttondown', ['button'])
            .post('mouseUp', '/session/:sessionId/buttonup', ['button'])
            .post('touchClick', '/session/:sessionId/touch/click', ['element'])
            .post('touchDown', '/session/:sessionId/touch/down', ['x', 'y'])
            .post('touchUp', '/session/:sessionId/touch/up', ['x', 'y'])
            .post('touchMove', 'session/:sessionId/touch/move', ['x', 'y'])
            .post('touchScroll', 'session/:sessionId/touch/scroll', ['element', 'xoffset', 'yoffset'])
            .post('touchDoubleClick', 'session/:sessionId/touch/doubleclick', ['element'])
            .post('touchLongClick', 'session/:sessionId/touch/longclick', ['element'])
            .post('touchFlick', 'session/:sessionId/touch/flick', ['element', 'xoffset', 'yoffset', 'speed', 'xspeed', 'yspeed'])
            .get('getGeoLocation', '/session/:sessionId/location')
            .post('setGeoLocation', '/session/:sessionId/location', ['location'])
            .post('setLocalStorage', '/session/:sessionId/local_storage', ['key', 'value'])
            .get('getLocalStorageKeys', '/session/:sessionId/local_storage')
            .delete('clearLocalStorage', '/session/:sessionId/local_storage')
            .get('getLocalStorageValue', '/session/:sessionId/local_storage/key/:key')
            .delete('deleteLocalStorageValue', '/session/:sessionId/local_storage/key/:key')
            .get('getLocalStorageSize', '/session/:sessionId/local_storage/size')
            .get('getSessionStorageKeys', '/session/:sessionId/session_storage')
            .post('setSessionStorage', '/session/:sessionId/session_storage', ['key', 'value'])
            .delete('deleteSessionStorage', '/session/:sessionId/session_storage')
            .get('getSessionStorageValue', '/session/:sessionId/session_storage/key/:key')
            .delete('deleteSessionStorageValue', '/session/:sessionId/session_storage/key/:key')
            .get('getSessionStorageSize', '/session/:sessionId/session_storage/size')
            .post('getLog', '/session/:sessionId/log', ['type'])
            .get('getLogTypes', '/session/:sessionId/log/types')
            .get('getAppCacheStatus', '/session/:sessionId/application_cache/status')
            .create(Webdriver.prototype);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Webdriver;