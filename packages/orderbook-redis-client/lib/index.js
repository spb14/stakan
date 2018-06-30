const { readFileSync } = require('fs')

const Redis = require('ioredis')

const {
  flatten,
  props
} = require('ramda')

const setupScripts = require('./scripts')

/**
 *
 */


/**
 * Utils
 */


/**
 *
 */

class Client extends Redis {
  constructor () {
    super()

    setupScripts(this)
  }

  obcommit (...args) {
    return this.OBCOMMIT(...args)
  }

  obadd (key, seed, bids = [], asks = []) {
    const args = []

    const toArgs = props(['price', 'amount'])

    if (bids.length) {
      const members = bids.map(toArgs)
      args.push('BIDS', members)
    }

    if (asks.length) {
      const members = asks.map(toArgs)
      args.push('ASKS', members)
    }

    return this.OBADD(key, seed, ...flatten(args))
  }
}

module.exports = Client
