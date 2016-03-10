"use strict";
function addEventListener(sel, type, done) {
    'use strict';
    let em = getElement(sel.using, sel.value);
    if (!em)
        throw new Error('element not found');
    function evHandler(ev) {
        let res = {};
        let prop = ['absolute', 'acceleration', 'accelerationIncludingGravity', 'actionURL', 'alpha', 'altKey', 'animationName',
            'attrChange', 'attributeName', 'attributeValue', 'attrName', 'beta', 'bubbles', 'button', 'buttonID', 'buttons', 'cancelable',
            'cancelBubble', 'char', 'charCode', 'clientX', 'clientY', 'code', 'colno', 'commandName', 'contentOverflow', 'ctrlKey',
            'currentState', 'currentTarget', 'data', 'dataFld', 'dataTransfer', 'defaultPrevented', 'deltaMode', 'deltaX', 'deltaY',
            'deltaZ', 'detail', 'elapsedTime', 'eventPhase', 'expansion', 'files', 'fromElement', 'gamma', 'gestureObject',
            'hwTimestamp', 'height', 'inputMethod', 'inertiaDestinationX', 'inertiaDestinationY', 'interval', 'isPrimary',
            'isTrusted', 'items', 'key', 'keyCode', 'kind', 'lastState', 'layerX', 'layerY', 'length', 'lengthComputable',
            'lineno', 'loaded', 'locale', 'location', 'metaKey', 'msManipulationViewsEnabled', 'maxTouchPoints', 'movementX',
            'movementY', 'newURL', 'newValue', 'oldURL', 'origin', 'persisted', 'pointerEnabled', 'pointerId', 'pointerType',
            'pressure', 'prevValue', 'propertyName', 'reason', 'relatedNode', 'relatedTarget', 'repeat', 'returnValue', 'rotation',
            'rotationRate', 'scale', 'screenX', 'screenY', 'shiftKey', 'source', 'srcElement', 'state', 'target', 'tiltX', 'tiltY',
            'timeStamp', 'toElement', 'total', 'translationX', 'translationY', 'type', 'types', 'velocityAngular', 'velocityExpansion',
            'velocityX', 'velocityY', 'path', 'wasClean', 'wheelDelta', 'which', 'width', 'x', 'y', 'z'];
        for (let i of prop) {
            if (i in ev) {
                if (typeof ev[i] != 'object')
                    res[i] = ev[i];
            }
        }
        return res;
    }
    em.addEventListener(type, ev => {
        done(evHandler(ev));
    });
    function getElement(using, value) {
        'use strict';
        if (!using || !value)
            return;
        switch (using) {
            case 'id': return document.getElementById(value);
            case 'name': return document.getElementsByName(value)[0];
            case 'class name': return document.getElementsByClassName(value)[0];
            case 'tag name': return document.getElementsByTagName(value)[0];
            case 'css selector': return document.querySelector(value);
            case 'xpath': return document.evaluate(value, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            case 'link text': return getElementByLinkText(value, true);
            case 'partial link text': return getElementByLinkText(value);
            default: return;
        }
    }
    function getElementByLinkText(text, f) {
        var links = document.querySelectorAll('a');
        var i;
        for (i in links) {
            i = parseInt(i);
            if (i === i) {
                if (f)
                    if (links[i].textContent() === text)
                        return links[i];
                if (links[i].textContent().indexOf(text) >= 0)
                    return links[i];
            }
        }
    }
}
exports.addEventListener = addEventListener;
