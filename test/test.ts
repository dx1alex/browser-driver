import {Chrome} from '../index'

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
  init: { url: 'http://localhost:9515' },
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
    await bro.url('http://google.com')
    console.log(await bro.title())
    console.log(await bro.$('a').attr('href'))
    await bro.$('input[name="q"]').keys(['xxx', 'Return'])
    // for (let em of await bro.$$('#search h3 > a')) {
    //   console.log(await em.attr('href'))
    //   if (await em.isVisible()) await em.click()
    // }
    await bro.newTab(true)
    await bro.url('http://ya.ru')
    console.log(await bro.newWindow(true))
    await bro.url('http://ya.ru')
  }
  catch (e) {
    console.log(e)
  }
}
