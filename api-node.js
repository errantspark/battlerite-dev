const https = require('https')
const zlib = require('zlib')

let battlerite_api = function(key){
  const hostname = 'api.dc01.gamelockerapp.com'

  if (!key) {
      console.warn('an API key was not defined, only "/status" endpoint is available')
  }

  let headers = {
    "Accept-Encoding": "gzip",
    "Authorization": key,
    "Accept": "application/vnd.api+json"
  }

  const fetch = endpoint => {
    return new Promise((reso,reje) => {
      const handleResponse = res => {
        if (res.statusCode === 200) {
          let buffer = []
          res.pipe(zlib.createGunzip()) // unzip
            .on("data", data => buffer.push(data))
            .on("end", () => reso(JSON.parse(Buffer.concat(buffer))))
        } else {
          reje(res.statusCode)
        }
      }
      console.log(hostname,endpoint)

      https.get({hostname,path:endpoint,headers}, handleResponse).on('error', e => reje(e))
    })
  }

  return fetch
}

module.exports = battlerite_api
