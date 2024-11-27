# a-priori

Unit test micro-library for test-driven development of small 
personal projects and exercises. 

## Assertion

```js
// ./tests/some_case.js
import Assertion from 'assertion.js';

const testCase = Assertion()
  .setLabel('differently typed args to string')
  .setArgs(1, {}, false, null)
  .setExpect('1, {}, false, null')
  .build();
```

A test case that expects equality between expected and 
actual values. Served as a builder with simple assertions to
encourage proper usage.

Consists of 3 required properties:
1. Label string
2. Function arguments
3. Expected value from inputs

## Test

```js
// ./tests/some_test.js

import { testCase } from './tests/some_case.js';
import { concat } from '../src/strings.js';
import Test from 'test.js';

const test = Test()
  .setTarget(concat)
  .setCondition(function() {
    return this.expect === this.actual;
  })
  .addCase(testCase)
  .build();
```

Container for test cases that supplies the function to be 
tested and a function to determine if the test case has 
passed.

Consists of 3 required properties:
1. Target function
2. Condition function to evaluate equality
3. At least 1 test case

## Set

```js
// ./tests/some_set.js

import { test } from './some_test.js';
import stringTests from 'set.js';

stringTests.add(test);
stringTests.run();
```

Container for tests for conveniently grouping tests. Has no
required properties.