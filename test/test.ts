import {Browser} from '../'

const bro = new Browser({
  init: { url: 'http://localhost:9515' },
  desiredCapabilities: {
    browserName: 'chrome'
  }
})

main()
async function main() {
  try {
    await bro.start()
    await bro.url('http://google.com')
    console.log(await bro.title())
  }
  catch (e) {
    console.log(e)
  }
}
