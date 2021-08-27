const Assert = require('assert')
const { fetchProp, MissingPropError } = require('../')


describe('fetchProp', () => {
  describe('when the object has the prop', () => {
    it('returns its value', () => {
      const obj = { foo: 37 }
      const ans = fetchProp(obj, 'foo')

      expect(ans).toEqual(37)
    })

    describe('when given the validator argument', () => {
      const assertion_err = new Error('lorem ipsum')

      const assertNumber = x => {
        if (typeof x === 'number') return
        throw assertion_err
      }

      describe('when the value passes the validation', () => {
        it('returns the value', () => {
          const obj = { quix: 41 }
          const ans = fetchProp(obj, 'quix', assertNumber)

          expect(ans).toEqual(41)
        })
      })

      describe('when the value fails the validation', () => {
        it('throws an error', () => {
          const obj = { quix: '41' }

          try {
            fetchProp(obj, 'quix', assertNumber)
          } catch (err) {
            expect(err).toEqual(assertion_err)
            return
          }

          Assert.fail('Expected an error to be thrown')
        })
      })
    })
  })

  describe('when the object does not have the prop', () => {
    it('throws an error', () => {
      const obj = { foo: 37 }

      try {
        fetchProp(obj, 'bar')
      } catch (err) {
        expect(err).toEqual(jasmine.any(Error))
        expect(err).toEqual(jasmine.any(MissingPropError))
        expect(err.message).toEqual('missing prop: "bar"')
        return
      }

      Assert.fail('Expected an error to be thrown')
    })
  })
})

