# fetch-prop
---
You can think of `fetchProp` as a strict property getter operator (e.g. `o.foo` or `o['foo']`). Unlike in vanilla JavaScript where you get `undefined` for non-existent properties, `fetchProp` will immediately signal an error.

Consider:
```
function addOne(wrapper) {
    const { value } = wrapper
    return value + 1
}

const ans = addOne(37)
console.log(ans) // outputs: NaN
```

Now with `fetchProp`:
```
function addOne(wrapper) {
    const value = fetchProp(wrapper, 'value')
    return value + 1
}

addOne(37)
// throws Uncaught MissingPropError: "foo"
//     at /home/lilsweetcaligula/my_app/index.js:6:13
```

# Table of Contents
1. [Installation](#installation)
2. [Fetching a prop](#fetching-a-prop)
3. [Fetching nested props](#fetching-nested-props)
4. [Assertions](#assertions)
5. [Predicates](#predicates)
6. [Issues](#issues)
7. [License](#license)

# Installation
```
$ npm install fetch-prop -E --save
```

Require `fetchProp` in your code like so:
```
const { fetchProp } = require('fetch-prop')
```

# Fetching a prop
```
const obj = { foo: 'bar' }
const foo = fetchProp(obj, 'foo')
```

# Fetching nested props
```
const obj = { bar: { foo: 37 }, foo: 123 }
const foo = fetchProp(obj, ['bar', 'foo'])

console.log(foo) // outputs: 37
```

# Assertions
For added safety, `fetchProp` allows to run assertions on the value (or its type)
at runtime - for that simply pass a function as the last argument which does the assertions:
```
const obj = { foo: 'bar' }
const assertNumber = x => Assert(typeof x === 'number', 'must be a number')

const foo = fetchProp(obj, 'foo', assertNumber)

// throws AssertionError: "must be a number"
```

This works especially well with the `assert-plus` package (needs to be installed separately):
```
const Assert = require('assert-plus')
const obj = { foo: 'bar' }
const foo = fetchProp(obj, 'foo', Assert.string)

console.log(foo) // outputs: bar
```

You are not limited to asserting on the value's type:
```
const obj = { foo: -5 }
const mustBePositive = x => if (x <= 0) throw new Error('must be positive')
const foo = fetchProp(obj, 'foo', mustBePositive)

// throws Error: "must be positive"
```

# Predicates
If the last argument to `fetchProp` returns false, then it is assumed that the value
failed the check and, as a result, an AssertionError will be thrown. This way, you may
easily use your predicates to test values:
```
const obj = { foo: -5 }
const isPositive = x => x > 0
const foo = fetchProp(obj, 'foo', isPositive)

// throws AssertionError: "prop \"foo\" failed the assertion"
```

# Issues
Please feel free to submit issues and feature requests here [here](https://github.com/lilsweetcaligula/fetch-prop/issues).

# License
MIT License

Copyright (c) 2021 Efim Bogdanovsky

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
