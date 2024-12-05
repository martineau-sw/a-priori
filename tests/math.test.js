import formulate from "../src/test.js";

function add(a, b) {
  return a + b;
}

formulate(add, (a, b) => a === b)
  .assert('adds')
    .when(2, 2)
    .then(4)
  .assert('concats')
    .when('2', '2')
    .then(4)
  .assert('skips').skip()
    .when(0, 0)
    .then(0)
  .end();
