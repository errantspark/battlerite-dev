const https = require('https')
const zlib = require('zlib')

let battlerite_api_https = function(key){
  const hostname = 'api.dc01.gamelockerapp.com'

  let headers = {
    'Accept-Encoding': 'gzip',
    'Authorization': key,
    'Accept': 'application/vnd.api+json'
  }

  if (!key) {
      console.warn('an API key was not defined, only `api.status()` endpoint is available')
  }

  const fetch = path => {
    return new Promise((reso,reje) => {
      const handleResponse = res => {
        if (res.statusCode === 200) {
          let buffer = []
          res.pipe(zlib.createGunzip()) // unzip
            .on('data', data => buffer.push(data))
            .on('end', () => reso(JSON.parse(Buffer.concat(buffer))))
        } else {
          reje(res.statusCode)
        }
      }
      console.log(path)

      https.get({hostname,path,headers}, handleResponse).on('error', e => reje(e))
    })
  }

  return fetch
}

module.exports = battlerite_api_https 
