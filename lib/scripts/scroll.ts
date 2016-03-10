export function scroll(x, y, f) {
  if (f) {
    var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    if (f == 'center') {
      y -= screenHeight / 2
    }
    if (f == 'bottom') {
      y -= screenHeight
    }
    window.scrollTo(x, y)
  } else {
    window.scrollBy(x, y)
  }
  return [x, y]
}
