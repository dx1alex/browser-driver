let auth, proxy, run = false

chrome.proxy.settings.clear({})

chrome.webRequest.onBeforeRequest.addListener(details => {
    console.log('onBeforeRequest', details.url)

    let param = details.url.replace('http://proxy/?', '')

    if (param == 'clear') {
        console.log('clear')
        chrome.proxy.settings.clear({})
        return {
            cancel: true
        }
    }

    let pa = param.split('@')

    if (pa.length == 1) {
        proxy = pa[0]
    } else {
        [auth, proxy] = pa
    }

    let [host, port] = proxy.split(':')

    chrome.proxy.settings.set({
        value: {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host,
                    port: +port
                }
            }
        },
        scope: 'regular'
    })

    return {
        cancel: true
    }
}, {
    urls: ["http://proxy/?*"]
}, ["blocking"])

chrome.webRequest.onAuthRequired.addListener(details => {
    console.log('onAuthRequired', details.url)

    if (details.isProxy === true) {
        if (!auth) return

        let [login, password] = auth.split(':')
        console.log(login, password)

        return {
            authCredentials: {
                'username': login,
                'password': password
            }
        }
    }
}, {
    urls: ["<all_urls>"]
}, ["blocking"])
