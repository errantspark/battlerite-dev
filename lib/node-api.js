const https = require('https')
const zlib = require('zlib')

let battlerite_https = function(key){
  const hostname = 'api.dc01.gamelockerapp.com'

  let headers = {
    'Accept-Encoding': 'gzip',
    'Authorization': key,
    'Accept': 'application/vnd.api+json'
  }

  if (!key) {
      console.warn('an API key was not defined, only `api.status()` endpoint is available')
  }

  const handleResponse = (resolve,reject) => response => {
    if (response.statusCode === 200) {
      if (response.headers['content-encoding'] === 'gzip') {
        let buffer = []
        response.pipe(zlib.createGunzip()) // unzip
          .on('data', data => buffer.push(data))
          .on('end', () => resolve(JSON.parse(Buffer.concat(buffer))))
      } else {
        let buffer = []
        response.on('data', data => buffer.push(data))
          .on('end', () => resolve(JSON.parse(Buffer.concat(buffer))))
      }
    } else {
      reject(response.statusCode)
    }
  }

  const apiEndpoint = path => new Promise((resolve,reject) => {
    https.get({hostname,path,headers}, handleResponse(resolve,reject))
      .on('error', error => reject(error))
  })

  const telemetryEndpoint = (hostname, path) => new Promise((resolve,reject) => {
    https.get({hostname,path}, handleResponse(resolve,reject))
      .on('error', error => reject(error))
  })

  return {apiEndpoint,telemetryEndpoint}
}

module.exports = battlerite_https 
