import {Browser} from '../'

const bro = new Browser({
  init: { url: 'http://localhost:9515' },
  desiredCapabilities: {
    browserName: 'chrome'
  }
})

bro.start().then(() => {
  bro.url('http://google.com')
})
