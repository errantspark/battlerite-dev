# battlerite-api
a javascript wrapper for the battlerite API

## Contents
* [About](#about)
* [Install](#install)
* [Usage Examples](#usage examples)
* [Documentation](#documetation)
* [Todo/Wishlist](#todo/wishlist)
* [License](#license)

## About
A modular API wrapper for the [Battlerite](https://www.battlerite.com) [Developer API](https://developer.battlerite.com). Currently there is a module that provides a simple `endpoint querystring` => `json object` function. (`lib/node-api.js`) I plan to write a function that provides the same interface for the browser. A second module (`lib/lib.js`) consumes the first and provides an fully featured JavaScript API interface. An entrypoint for inclusion in node.js programs is provided in `index.js`

### Prior Art
* https://github.com/carlerikjohan/battlerite-api
* https://github.com/sime1/battlerite-node

My approach is decidedly more minimal than either of those, using much less code and no dependencies. I don't think this is better, just different.

* https://github.com/jlajoie/battlerite-api/

This is a tool which provides a wrapper around the internal API as used by the game itself, unfortunately that API is about a million times more useful than the official one (go figure)

## Install
You're going to want to have a recent node.
```bash
npm i -s battlerite-dev
```

## Usage Examples
Initiialize the API like so
```javascript
const Battlerite_Dev = require('battlerite-dev')
const api = new Battlerite_Dev({key: "your_very_long_api_key"}) 
```
a function exists corresponding to each API endpoint, consuming an `options` object and returning a promise that resolves to the requested JSON, for example:
```javascript
api.status().then(r => console.log(r))
```
or
```javascript
let options = {
  filter: {
    gameMode: ['ranked','casual']
  }
} 
api.matches(options).then(r => console.log(r))
```
or
```javascript
api.match('id_hash_as_string').then(r => console.log(r))
```
## Documentation
### Battlerite API Notes
The [matches](http://battlerite-docs.readthedocs.io/en/latest/matches/matches.html#get-a-collection-of-matches) endpoint doesn't quite behave as the docs state.
Not only that, but there's currently no way of getting a playerId <=> playerName relationship using the official api, if you hit the unofficial API though you can get the data

`filter[gameMode]` returns a 404 if you use `ranked` or `casual` as the filterstring, but it does work if you use `1733162751`, which is sent as the `data.attributes.gameMode` with every(?) match right now
`filter[teamName]` returns a 404 regardless of query? i've tried the team name as a string, and also the long id hash that is provided in roster objects

### Methods
```javascript

```


## Todo/Wishlist

* Handling of telemetry data
* Proper code documentation (JSDoc?)
* Rewrite the whole thing in typescript/purescript
* Tests?

## License

MIT
