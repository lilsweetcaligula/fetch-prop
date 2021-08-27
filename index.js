const Assert = require('assert')
const { AssertionError } = Assert


function fetchProp(obj, prop_or_props, assertType = x => {}) {
  Assert(null != obj && typeof obj === 'object',
    'The "obj" argument must be an object')

  Assert(assertType instanceof Function,
    'The "assertType" argument must be a function')


  const props = Array.isArray(prop_or_props)
    ? prop_or_props
    : [prop_or_props]

  const prop_name = props.join('.')


  const x = props.reduce((o, prop) => {
    if (!(typeof o === 'object' && prop in o)) {
      throw new MissingPropError(`missing prop: "${prop_name}"`)
    }

    return o[prop]
  }, obj)


  const is_ok = assertType(x)

  if (typeof is_ok === 'boolean' && !is_ok) {
    throw new AssertionError({
      message: `prop "${prop_name}" failed the assertion`
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
