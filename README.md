# battlerite-api
a javascript wrapper for the battlerite API

## Contents
* [About](#about)
* [Install](#install)
* [Usage](#usage)
* [More Info](#more info)
* [Todo/Wishlist](#todo/wishlist)
* [License](#license)

## About
A modular API wrapper for the [Battlerite](https://www.battlerite.com) [Developer API](https://developer.battlerite.com). Currently there is a module that provides a simple `endpoint querystring` => `json object` function. (`lib/node-api.js`) I plan to write a function that provides the same interface for the browser. A second module (`lib/lib.js`) consumes the first and provides an fully featured JavaScript API interface. An entrypoint for inclusion in node.js programs is provided in `index.js`

### Prior Art
* https://github.com/carlerikjohan/battlerite-api
* https://github.com/sime1/battlerite-node

My approach is decidedly more minimal than either of those, using much less code and no dependencies. I don't think this is better, just different.

## Install
You're going to want to have a recent node.
```
npm i -s battlerite-dev
```

## Usage
Initiialize the API like so
```
const Battlerite_Dev = require('battlerite-dev')
const api = new Battlerite_Dev("your_very_long_api_key_as_a_string") 
```
a function exists corresponding to each API endpoint, consuming an `options` object and returning a promise that resolves to the requested JSON, for example:
```
api.status().then(r => console.log(r))
```
or
```
let options = {
  filter: {
    gameMode: ['ranked','casual']
  }
} 
api.matches(options).then(r => console.log(r))
```




## Todo/Wishlist

* Proper code documentation (JSDoc?)
* Rewrite the whole thing in typescript/purescript
* Tests?

## License

MIT
