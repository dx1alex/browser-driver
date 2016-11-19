#!/usr/bin/env node

import { Chrome } from '../index'

const bro = new Chrome({
  dir: '/tmp/test2',
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
    //console.log(bro.capabilities)
    //await bro.setProxy('91.240.86.186:9000')
    await bro.url('http://ya.ru')
  }
  catch (e) {
    console.log(e)
  }
}
