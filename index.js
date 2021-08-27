const Assert = require('assert')
const { AssertionError } = Assert


function fetchProp(obj, prop, assertType = x => {}) {
  Assert(assertType instanceof Function,
    'The assertType argument must be a function')

  if (!(prop in obj)) {
    throw new MissingPropError(`missing prop: "${prop}"`)
  }

  const x = obj[prop]
  const check = assertType(x)

  if (typeof check === 'boolean' && !check) {
    throw new AssertionError({
      message: `prop "${prop}" failed the assertion`
    })
  }

  return x
}


class MissingPropError extends Error {
  constructor(...args) {
    super(...args)
    this.name = 'MissingPropError'
  }
}


module.exports = { fetchProp, MissingPropError, AssertionError }
