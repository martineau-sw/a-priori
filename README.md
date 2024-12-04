# a-priori

Lightweight unit test micro-library for test-driven development 
of small personal projects and exercises. 

Created with the intent to ~~quickly~~ vaguely formalize unit/system 
requirements as axioms formulated as material conditions. 
(e.g. $P(x, y, z) \longrightarrow Q $)

Takes inspiration from the information gathered on Wikipedia of 
formal logic systems in span of a single sleepless night. 

## Assertion

An object consisting of a summary, function arguments, and 
expected output.

## Sequent

An object consisting of a function as the subject of test cases 
(formula), a callback to predicate equality between the returned
value and expected output, and a set of assertions.

## Usage

1. Create tests within `project_directory/tests/` with `.test.js`
suffix
2. Default import `sequent.js`
3. Declare sequent with subject function and equality function
4. Add assertions using chained function calls
  - `when(arguments)` accepts arguments to pass into subject 
  function
  - `then(expected)` accepts expected return value of subject
  function `when` parameters are true.
5. `npx run-func some/dir/a-priori.js run`

### Example

```
project/
| src/
| | add.js
| | sub.js
| tests/
| | add.test.js
| | sub.test.js
```

```js
// src/add.js
function add() {
  return +a + b;
}

// src/sub.js
function sub() {
  return a - b;
}
```

```js
// tests/sub.test.js

import sequent from './some/dir/to/sequent.js';

sequent (sub, (a, b) => a === b)
  .assertion('numbers: positive difference')
    .when(2, 1)
    .then(1)
  .assertion('numbers: negative difference')
    .when(1, 2)
    .then(-1)
  .assertion('numbers: handles small floats')
    .when(0.000005, 0.000008)
    .then(-0.000003)
  .assertion('strings: rejects strings').skip()
    .when('-2', '-5')
    .then(undefined)
.end();
```

