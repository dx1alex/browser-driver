export * from './addField'
export * from './dispatchEvent'
export * from './setAttribute'
export * from './setProperty'
export * from './addEventListener'
export * from './scroll'

function getElement(using, value): any {
  if (!using || !value) return
  switch (using) {
    case 'id': return document.getElementById(value)
    case 'name': return document.getElementsByName(value)[0]
    case 'class name': return document.getElementsByClassName(value)[0]
    case 'tag name': return document.getElementsByTagName(value)[0]
    case 'css selector': return document.querySelector(value)
    case 'xpath': return document.evaluate(value, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    case 'link text': return getElementByLinkText(value, true)
    case 'partial link text': return getElementByLinkText(value)
    default: return
  }
}

function getElementByLinkText(text, f?) {
  var links: any = document.querySelectorAll('a')
  var i: any
  for (i in links) {
    i = parseInt(i)
    if (i === i) {
      if (f) if (links[i].textContent() === text) return links[i]
      if (links[i].textContent().indexOf(text) >= 0) return links[i]
    }
  }
}
