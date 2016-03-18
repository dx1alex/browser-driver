import {ChromeSync} from '../index'
import {Sync} from 'sync-plus'

const bro = new ChromeSync({
  init: { url: 'http://localhost:9515' },
  desiredCapabilities: {
    browserName: 'chrome'
  }
})

try {
  bro.start({ size: [1200, 800] })
  bro.url('http://google.com')
  console.log(bro.title())
  bro.$('input[name="q"]').keys(['xxx', 'Return'])
  Sync.sleep(1000)
  bro.$$('#search .g h3 > a').map(em => {
    console.log(em.attr('href'))
    if (em.isVisible()) em.click()
  })
}
catch (e) {
  console.log(e)
}
