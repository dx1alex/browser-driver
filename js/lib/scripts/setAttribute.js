"use strict";
function setAttribute(sel, name, value) {
    var em = getElement(sel.using, sel.value);
    if (!em)
        throw new Error('element not found');
    em.setAttribute(name, value);
    return value;
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
exports.setAttribute = setAttribute;
