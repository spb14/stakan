const R = require('ramda')

const { cached } = require('./utils')

/**
 * Side collection
 *
 * Side :: [Order] -> Side
 */

class Side {
  /**
   * from
   */

  static from (entries) {
    const Constructor = this
    return new Constructor(entries)
  }

  /**
   * of
   */

  static of (entry) {
    return this.from([ entry ])
  }

  /**
   * empty :: Side m => () -> m
   */

  static empty () {
    return this.from([])
  }

  /**
   * Constructor
   */

  constructor (entries = []) {
    if (entries instanceof this.constructor) return entries

    const get = xs => [...new Map(xs)] // eliminate duplicates

    this.valueOf = R.thunkify(cached(get))(entries)
  }

  /**
   * equals :: Side a => a ~> a -> Boolean
   */

  equals (that) {
    return R.equals([...this], [...that])
  }

  /**
   * concat :: Side a => a ~> a -> a
   */

  concat (that) {
    return Side.from([...this, ...that])
  }

  /**
   * map :: Side f => f a ~> (a -> b) -> f b
   */

  map (fn) {
    const entries = R.map(fn, [...this])
    return Side.from(entries)
  }

  /**
   * filter :: Side f => f a ~> (a -> Boolean) -> f a
   */

  filter (pred) {
    const entries = R.filter(pred, [...this])
    return Side.from(entries)
  }

  /**
   * reduce :: Foldable f => f a ~> ((b, a) -> b, b) -> b
   */

  reduce (fn, acc) {
    return R.reduce(fn, acc, [...this])
  }

  //

  toArray () {
    return this.valueOf()
  }

  [Symbol.iterator] () {
    const entries = this.valueOf()
    let i = 0
    return {
      next: () => {
        if (i === entries.length) {
          return { done: true }
        }
        return { value: entries[i++] }
      }
    }
  }
}

/**
 * Bids
 */

class Bids extends Side {
  constructor (entries) {
    super(entries)

    // sort from highes (best) to lowest
    const byPrice = R.descend(R.prop(0))

    const get = R.compose(
      R.sort(byPrice),
      this.valueOf
    )

    this.valueOf = R.thunkify(cached(get))()
  }
}

/**
 * Asks
 */

class Asks extends Side {
  constructor (entries) {
    super(entries)

    // sort from lowest (best) to highest
    const byPrice = R.ascend(R.prop(0))

    const get = R.compose(
      R.sort(byPrice),
      this.valueOf
    )

    this.valueOf = R.thunkify(cached(get))()
  }
}

module.exports = Side
module.exports.Bids = Bids
module.exports.Asks = Asks
