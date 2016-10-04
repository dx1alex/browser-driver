export function getImage(selector, done) {
  let img = document.querySelector('img')
  if (img.complete) {
    toDataUrl()
  } else {
    img.addEventListener('load', toDataUrl)
  }
  function toDataUrl(outputFormat?) {
    let canvas = document.createElement('CANVAS')
    let ctx = canvas.getContext('2d')
    canvas.height = img.height
    canvas.width = img.width
    ctx.drawImage(img, 0, 0)
    let dataURL = canvas.toDataURL(outputFormat)
    done(dataURL)
  }
}
