import { Chrome } from '../index'

const bro = new Chrome({
  dir: '/tmp/test1',
  prefs: {
    profile: {
      content_settings: {
        exceptions: {
          images: {
            "https://vk.com:443,https://vk.com:443": {
              setting: 1
            }
          }
        }
      },
      "default_content_setting_values": {
        "images": 2
      }
    }
  },
  init: { url: 'http://localhost:9516' },
  desiredCapabilities: {
    browserName: 'chrome'
  }
})

//bro.pause = 1000

main()
async function main() {
  try {
    let res = await bro.start({ size: [1200, 800] })
    console.log(bro.capabilities)
    await bro.url('https://habrahabr.ru/')
    console.log(await bro.getImage('img', './test.png'))
    await bro.url('http://ya.ru')
  }
  catch (e) {
    console.log(e)
  }
}
