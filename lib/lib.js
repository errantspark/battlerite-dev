const nodeUrl = require('url')

const battlerite_api_factory = br_https => {
  const {apiEndpoint: API, telemetryEndpoint: TEL} = br_https
  const defShard = `/shards/global/`

  let optionsToQuery = opts => {
    let template = {
      sort: 'sort',
      page: {
        offset: 'page[offset]',
        limit: 'page[limit]'
      },
      filter: {
        createdAt: {
          start: 'filter[createdAt-start]',
          end: 'filter[createdAt-end]'
        },
        teamNames: 'filter[teamNames]',
        playerIds: 'filter[playerIds]',
        steamIds: 'filter[steamIds]',
        playerNames: 'filter[playerNames]',
        gameMode: 'filter[gameMode]',
        patchVersion: 'filter[patchVersion]',
      },
      tag: {
        season: 'tag[Season]',
        playerIds: 'tag[playerIds]',
      }
    }

    let applyTemplate = (template, options) => Object.entries(options).map(kv =>{
      let [key,value] = kv
      let queryKey = template[key]
      if (typeof queryKey === 'string') {
        return [`${queryKey}=${value}`]
      } else {
        return applyTemplate(queryKey, value).reduce((a,b) => a.concat(b))
      }
    })

    return applyTemplate(template, opts).join('&')
  }

  let raw = path => API(path)
  let rawTelemetry = url => {
    let parsedUrl = nodeUrl.parse(url)
    return TEL(parsedUrl.hostname, parsedUrl.path)
  } 
  let status = () => API('/status')
  let player = playerID => {
    if (Array.isArray(playerID)){
      return API(`${defShard}players?filter[playerIds]=${playerID}`)
    } else {
      return API(`${defShard}players/${playerID}`)
    }
  }
  let players = (opts = {}) => API(`${defShard}players?${optionsToQuery(opts)}`)
  let match = matchID => API(`${defShard}matches/${matchID}`)
  let matches = (opts = {}) => API(`${defShard}matches?${optionsToQuery(opts)}`)
  let teams = (opts = {}) => API(`${defShard}teams?${optionsToQuery(opts)}`)
  let telemetry = (matchID, opts) => new Promise(async (resolve,reject) => {
    let id = matchID
    let {url} = opts
    let matchData = await match(id)
    let telemetryUrl = matchData.included.find(x => x.type === "asset").attributes.URL
    if (returnUrl){
      resolve(telemetryUrl)
    } else {
      let parsedUrl = nodeUrl.parse(telemetryUrl)
      resolve(TEL(parsedUrl.hostname, parsedUrl.path))
    }
  })

  return {status, match, matches, player, players, match, team, telemetry, raw, rawTelemetry}
}

module.exports = battlerite_api_factory
