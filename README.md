# a-priori

Lightweight unit test micro-library for test-driven development 
of small personal projects and exercises. 

## Usage

1. Create test file: `./tests/*.test.js` where `*` is some name
2. Default import `a-priori`: this is the `formulate` function. It's implemented 
as a builder.
3. Call `formulate` with target function and an *equals* function with 2 
parameters
4. Append `assert`s with a summary, append `when` with arguments of target
function as a test, and finally, append `then` with expected return.
5. Call `end` at the end of the final `then` of the final `assert`
6. Run `$ a-priori` from project root

## Overview

`formulate(targetFunction, equalFunction) -> Test.builder` *static method of `Test`*
  Creates test and sets target function and evaluation functions to determine 
  equality between actual return value and expected value. 

  - `targetFunction`, any named function object
  - `equalFunction`, function object with 2 parameters. For simple value types: 
  `(a, b) => a === b` is sufficent

`assert(summary) -> Assertion.builder` *static member of `Test.builder`*
  Creates assertion and sets string that describes the assertion.

  - `summary`, string that describes the assertion

`when(...arguments) -> Assertion.builder` *static member of `Assertion.builder`*
  Sets arguments to supply for target function.

  - `...arguments`, variadic, pass these arguments as if they are to be passed
  to the target function

  ```js
  formulate(function add(a, b) { return a + b; }, (x, y) => x === y)
    .assert('number addition') 
      .when(2, 2) // add(2, 2)
      // ...
  ```

`then(expected) -> Test.builder` *static member of `Assertion.builder`*
  Sets expected value for assertion, returns test builder.

  - `expected`, expected return value of target function with `when` arguments

  ```js
  formulate(function add(a, b) { return a + b; }, (x, y) => x === y)
    .assert('number addition') 
      .when(2, 2)
      .then(4)
      // ...
  ```

`end() -> Test` *static method of `Test.builder`*
  Submits test to testing application.

  ```js
  formulate(function add(a, b) { return a + b; }, (x, y) => x === y)
    .assert('number addition') 
      .when(2, 2)
      .then(4)
      // ...
  .end();
  ```

`skip() -> undefined`
*static method of `Test.builder` and `Assertion.builder`*
*instance method of `Test` and `Assertion`*

  Skips test or assertion, can be called on builder or instances.