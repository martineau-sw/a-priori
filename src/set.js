class Set {
  constructor() {
    this.tests = [];
  }

  add(test) {
    this.tests.push(test);
    return this;
  }

  run() {
    for (const test of this.tests) {
      if (test.options.skip) return;
      test.executeAll();
    }
  }
}

export default new Set();