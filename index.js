
function fetchProp(obj, prop, assertType = x => {}) {
  if (!(prop in obj)) {
    throw new MissingPropError(`missing prop: "${prop}"`)
  }

  const x = obj[prop]

  assertType(x)

  return x
}


class MissingPropError extends Error {
  constructor(...args) {
    super(...args)
    this.name = 'MissingPropError'
  }
}


module.exports = { fetchProp, MissingPropError }
