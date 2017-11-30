const API = require("./lib/node-api.js")
const LIB = require("./lib/lib.js")

module.exports = function(options) {
  let key = options.key
  let api = new API(key)
  return LIB(api)
}
