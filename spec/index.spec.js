const Assert = require('assert')
const { fetchProp, MissingPropError, AssertionError } = require('../')


describe('fetchProp', () => {
  describe('when the prop is atomic', () => {
    describe('when the object has the prop', () => {
      describe('when the prop is a string', () => {
        it('returns its value', () => {
          const obj = { foo: 37 }
          const ans = fetchProp(obj, 'foo')

          expect(ans).toEqual(37)
        })
      })

      describe('when the prop is null', () => {
        it('returns its value', () => {
          const obj = {}
          obj[null] = 41

          const ans = fetchProp(obj, null)

          expect(ans).toEqual(41)
        })
      })

      describe('when given the validator argument', () => {
        describe('when the validator argument is not a function', () => {
          it('throws an error', () => {
            const obj = { quix: 41 }

            try {
              fetchProp(obj, 'quix', 123)
            } catch (err) {
              expect(err).toEqual(jasmine.any(AssertionError))

              expect(err.message)
                .toEqual('The "assertType" argument must be a function')

              return
            }

            Assert.fail('Expected an error to be thrown')
          })
        })

        describe('normally', () => {
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

        describe('when the validator returns a boolean', () => {
          const assertion_err = new Error('lorem ipsum')

          const assertNumber = x => {
            return typeof x === 'number'
          }

          describe('when the value passes the validation', () => {
            it('returns the value', () => {
              const obj = { quix: 41 }
              const ans = fetchProp(obj, 'quix', assertNumber)

              expect(ans).toEqual(41)
            })
          })

          describe('when the value fails the validation', () => {
            it('throws an assertion error', () => {
              const obj = { quix: '41' }

              try {
                fetchProp(obj, 'quix', assertNumber)
              } catch (err) {
                expect(err).toEqual(jasmine.any(AssertionError))

                expect(err.message)
                  .toEqual('prop "quix" failed the assertion')

                return
              }

              Assert.fail('Expected an error to be thrown')
            })
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
          expect(err.message).toEqual('"bar"')

          return
        }

        Assert.fail('Expected an error to be thrown')
      })
    })

    describe('when the obj argument is a string', () => {
      it('does not work on strings', () => {
        const str = 'lorem'

        try {
          fetchProp(str, 'length')
        } catch (err) {
          expect(err).toEqual(jasmine.any(AssertionError))

          expect(err.message)
            .toEqual('The "obj" argument must be an object')

          return
        }
      })
    })

    describe('when the obj argument is null', () => {
      it('does not work on non-objects', () => {
        try {
          fetchProp(null, 'length')
        } catch (err) {
          expect(err).toEqual(jasmine.any(AssertionError))

          expect(err.message)
            .toEqual('The "obj" argument must be an object')

          return
        }
      })
    })
  })

  describe('when the prop is an array', () => {
    describe('the prop-array has the length of 1', () => {
      describe('when the object has the prop', () => {
        it('returns the value', () => {
          const obj = { lorem: 'ipsum' }
          const ans = fetchProp(obj, ['lorem'])

          expect(ans).toEqual('ipsum')
        })
      })

      describe('when the object does not have the prop', () => {
        it('throws an error', () => {
          const obj = { lorem: 'ipsum' }

          try {
            fetchProp(obj, ['abc'])
          } catch (err) {
            expect(err).toEqual(jasmine.any(Error))
            expect(err).toEqual(jasmine.any(MissingPropError))
            expect(err.message).toEqual('"abc"')

            return
          }

          Assert.fail('Expected an error to be thrown')
        })
      })
    })

    describe('the prop-array has more than 1 item', () => {
      describe('when there is a path described by the prop array', () => {
        it('returns the value', () => {
          const obj = { lorem: { ipsum: 'foo' }, ipsum: 'baz' }
          const ans = fetchProp(obj, ['lorem', 'ipsum'])

          expect(ans).toEqual('foo')
        })
      })

      describe('when there is no path described by the prop array', () => {
        it('throws an error', () => {
          const obj = { lorem: { ipsum: 123 }, ipsum: 'baz' }

          try {
            fetchProp(obj, ['lorem', 'ipsum', 'dolor'])
          } catch (err) {
            expect(err).toEqual(jasmine.any(Error))
            expect(err).toEqual(jasmine.any(MissingPropError))
            expect(err.message).toEqual('"lorem"."ipsum"."dolor"')

            return
          }

          Assert.fail('Expected an error to be thrown')
        })
      })
    })
  })
})

