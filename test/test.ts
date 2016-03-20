import {Chrome} from '../index'

const bro = new Chrome({
  init: { url: 'http://localhost:9515' },
  desiredCapabilities: {
    browserName: 'chrome'
  }
})
bro.pause = 1000

main()
async function main() {
  try {
    await bro.start({ size: [1200, 800] })
    await bro.url('http://google.com')
    console.log(await bro.title())
    console.log(await bro.$('a').attr('href'))
    await bro.$('input[name="q"]').keys(['xxx', 'Return'])
    for (let em of await bro.$$('#search h3 > a')) {
      console.log(await em.attr('href'))
      if (await em.isVisible()) await em.click()
    }
  }
  catch (e) {
    console.log(e)
  }
}
