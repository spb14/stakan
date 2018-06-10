const { Observable } = require('rxjs/Rx')

const {
  assoc,
  compose,
  reduce,
  pluck,
  applySpec,
  prop,
  last
} = require('ramda')

const {
  isNotEmpty
} = require('ramda-adjunct')

const Store = require('@stakan/store')
const Publisher = require('@stakan/publisher')

const Remote = require('./lib')

const OBH = require('./lib/helpers')

const store = new Store()
const publisher = new Publisher()

const remote = new Remote('btc-usd')

const close$ = Observable
  .fromEvent(remote, 'close')

const reset$ = Observable
  .fromEvent(remote, 'reset')
  .takeUntil(close$)

const update$ = Observable
  .fromEvent(remote, 'update')
  .takeUntil(close$)
  .bufferTime(25)
  .filter(isNotEmpty)
  .map(arr => {
    const concatAll = reduce(OBH.concat, [])

    const op = applySpec({
      ev     : compose(prop('ev'), last),
      broker : compose(prop('broker'), last),
      symbol : compose(prop('symbol'), last),
      bids   : compose(concatAll, pluck('bids')),
      asks   : compose(concatAll, pluck('asks'))
    })

    return op(arr)
  })

const noop = x => x

reset$
  .merge(update$)
  .flatMap(x => {
    return x.ev === 'reset'
      ? store.resetOrderBook(x)
      : store.updateOrderBook(x)
  })
  .subscribe(
    x => publisher.publish(x)
  )

remote.sync()