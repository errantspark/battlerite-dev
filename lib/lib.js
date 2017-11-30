const battlerite_api_wrapper = api => {
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
        playerNames: 'filter[playerNames]',
        playerIds: 'filter[playerIds]',
        gameMode: 'filter[gameMode]',
      }
    }

    let applyTemplate = (template, options) => Object.entries(options).map(kv =>{
      let [key,value] = kv
      let queryKey = template[key]
      if (typeof queryKey === 'string') {
        return [`${queryKey}=${value}`]
      } else  {
        return applyTemplate(queryKey, value).reduce((a,b) => a.concat(b))
      }
    })
    return applyTemplate(template, opts).join('&')
  }

  let getStatus = () => api('/status')
  let getMatches = (opts = {}) => api(`${defShard}matches?${optionsToQuery(opts)}`)

  return {getStatus, getMatches}
}

module.exports = battlerite_api_wrapper
