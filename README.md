 battlerite-api
a javascript wrapper for the battlerite API

## Contents
* [About](#about)
* [Install](#install)
* [Usage Examples](#usage-examples)
* [Documentation](#documetation)
* [Todo/Wishlist](#todowishlist)
* [License](#license)

## About
A modular API wrapper for the [Battlerite](https://www.battlerite.com) [Developer API](https://developer.battlerite.com). Currently there is a module that provides a simple `endpoint querystring` => `json object` function. (`lib/node-api.js`) I plan to write a function that provides the same interface for the browser. A second module (`lib/lib.js`) consumes the first and provides an fully featured JavaScript API interface. An entrypoint for inclusion in node.js programs is provided in `index.js`  

Last known to be compatible with API `v7.5.1`

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
### Methods
#### api.matches(options: Options)
the options object is a simple JSON representation of the possibly filter queries for the API
```typescript
interface Options {
  sort: "createdAt" | "-createdAt"
  page: {
    offset: number //number of matches to offset start of return data
    limit: number //max number of matches to report
  },
  filter: {
    createdAt: {
      start: //TODO look up what this is supposed to be 
      end: 
    },
    teamNames: any // no idea, anything i've tried returns a 404
    playerIds: string | string[] //returns matches that include ALL playersIds
    gameMode: number //only works with 1733162751, maybe there's anotherone for the battleground mode
  }
}
```
returns a promise that resolves to the API response
#### api.match(id: string)
returns a promise that resolves to the API response
#### api.status()
returns a promise detailing the API status, you don't need an API key for this one
#### api.telemetry(options TelemetryOptions)
returns a promise that resolves to an array of telemetry objects
```typescript
interface TelemetryOptions {
  id: string //match id
  returnUrl: boolean //if true returns just the URL
}
```
### Battlerite API Notes
The [matches](http://battlerite-docs.readthedocs.io/en/latest/matches/matches.html#get-a-collection-of-matches) endpoint doesn't quite behave as the docs state.  
Not only that, but there's currently no way of getting a playerId <=> playerName relationship using the official api, if you hit the unofficial API though you can get the data

`filter[gameMode]` returns a 404 if you use `ranked` or `casual` as the filterstring, but it does work if you use `1733162751`, which is sent as the `data.attributes.gameMode` with every(?) match right now  
`filter[teamName]` returns a 404 regardless of query? i've tried the team name as a string, and also the long id hash that is provided in roster objects  

### Telemetry API Notes
```typescript
type TelemetryType =
  | 'Structures.UserRoundSpell'
  | 'Structures.RoundEvent'
  | 'Structures.DeathEvent'
  | 'Structures.MatchReservedUser'
  | 'Structures.RoundFinishedEvent'
  | 'Structures.MatchFinishedEvent'
  | 'Structures.MatchStart'
  | 'Structures.ServerShutdown'
  | 'com.stunlock.battlerite.team.TeamUpdateEvent'
  | 'com.stunlock.service.matchmaking.avro.QueueEven'

interface TelemetryObject {
  cursor: number //not sure
  type: TelemetryType 
  dataObject : TelemetryData
}

interface TelemetryData {
  matchID: string
  time: number
  [prop: string]: any
}

type Telemetry = TememetryObject[]

```
#### Structures.MatchStart
```typescript
interface MatchStart extends TelemetryData {
  gameMode: number
  mapID: string
  matchID: string 
  region: string
  teamSize: number
  type: string //same as servertype in reserveduser
  version: string //"1.0"
}
```
#### Structures.MatchFinishedEvent
```typescript
interface MatchFinishedEvent extends TelemetryData {
  region: string // "us_southwest", "us_southeast", "us_west"
  matchLength: number
  teamOneScore: number
  teamTwoScore: number
  leavers: array
}
```
#### Structures.RoundFinishedEvent
the most interesting data end up here, mostly per-round score for the players
```typescript
interface RoundFinishedEvent extends TelemetryData {
  winningTeam: number //one indexed because fuck you
  round: number //zero indexed because zero consistency
  roundLength: number //in seconds, as an int
  playerStats: PlayerStats[]
}

interface PlayerStats {
  userID: string
  abilityUses: number
  damageDone: number
  damageReceived: number
  disablesDone: number
  disablesReceived: number
  healingDone: number
  healingReceived: number
  energyGained: number
  energyUsed: number
  kills: number // this may be some sort of binary encoding? it's not the # of player kills for sure
  deaths: number
  score: number
  timeAlive: number
}

```
#### Structures.RoundEvent
```typescript
interface RoundEvent extends TelemetryData {
  character: number
  round: number
  timeIntoRound: number //as far as I can tell this is always zero
  type: string //"MOUNT_DURATION", "ENERGY_ABILITY_USED", "ENERGY_SHARD_PICKUP", "HEALTH_SHARD_PICKUP", "ULTIMATE_USED", "MOUNTS_AFTER_ELEVATOR", "RUNE_LASTHIT", "ALLY_DEATH_ENERGY_PICKUP"
  value: number
}
```
#### Structures.MatchReservedUser
some data about each user, there's one of these for every user in a match
```typescript
interface MatchReservedUser extends TelemetryData {
  accountId: string //same as userID except with inconsistent caps
  attachment: number 
  character: number //character id same as actor?
  characterLevel: number
  characterTimePlayed: number
  division: number
  divisionRating: number
  emote: number
  league: number
  mount: number
  outfit: number
  rankingType: string //"RANKED" | "UNRANKED" | "NONE" maybe one more?
  seasonId: number
  serverType: string // "QUICK2V2" | "PRIVATE" | "QUICK3V3" there may also be additional ones
  team: number
  teamId: string 
  totalTimePlayed: number
}
```
#### Structures.DeathEvent
gives the death times of users, curiously it doesn't mention in which round the death occured
```typescript
interface DeathEvent extends TelemetryData {
  userID: string
}
```
#### Structures.ServerShutdown
```typescript
interface ServerShutdown extends TelemetryData {
  matchTime: number //a different number of seconds than matchLength, i think this is greater in all cases
  reason: string // only seen "EMPTY_SERVER" | "MATCH_COMPLETED" so far
}
```
#### Structures.UserRoundSpell
this one appears to be missing entries, there's on average ~60 of these per match which is way fewer than the actions I expect to happen, also the damage/healing totals don't add up to the ones in the other sources
I can't really figure out what the selection criteria for these is, at some point I may screencap a private match where we test some things out, and then try and correlate the data
```typescript
interface UserRoundSpell extends TelemetryData {
  scoreType: string //"USES", "DAMAGE_RECEIVED", "CONTROL_DONE", "CONTROL_RECEIVED", "DAMAGE_DONE", "ENERGY_RECEIVED", "HEALING_DONE", "HEALING_RECEIVED", "ENERGY_USED"
  scoreTypeId: number //presumably the id of the spell
  value: number
  round: number //zero indexed 
  character: number
  sourceTypeId: number
}
```
#### com.stunlock.battlerite.team.TeamUpdateEvent
this has how much MMR you won or lost
```typescript
interface TeamUpdateEvent extends TelemetryData {
}
```
#### com.stunlock.service.matchmaking.avro.QueueEvent
this is the matchmaker data, some of it overkaps with reserved user
```typescript
interface TeamUpdateEvent extends TelemetryData {
}
```




## Todo/Wishlist

* Rate Limiting
* Proper code documentation (JSDoc?)
* Rewrite the whole thing in typescript/purescript
* Tests?

## License

MIT
