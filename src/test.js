class Test {
  #target = undefined;
  #condition = undefined;
  #cases = undefined;
  #options = {
    print: true,
    includePass: true,
    expand: false,
    expandPass: false,
    expandFail: true,
    skip: false,
    skipInvalidCases: true,
  }

  #fails = 0;
  #skips = 0;

  constructor() {
    Object.seal(this.#options);
  }

  get target() { return this.#target; }
  get condition() { return this.#condition; }
  get cases() { return this.#cases; }
  get options() { return this.#options; }

  get passed() { return this.fails === 0; }
  get passes() { return this.#cases.length - (this.#fails + this.#skips); }
  get fails() { return this.#fails; }
  get skips() { return this.#skips; }

  static builder() {
    const test = new Test();
    
    const setTarget = function(target) {
      console.assert(test.#target === undefined, 'redefining function\nfrom: %o\nto: %o', test.#target, target);
      test.#target = target;
      return this;
    }

    const setCondition = function(condition) {
      console.assert(test.#condition === undefined, 'redefining condition\nfrom: %o\nto: %o', test.#condition, condition);
      console.assert(typeof condition === 'function', 'function with boolean return values expected %o', condition);
      test.#condition = condition;
      return this;
    }

    const addCase = function(testCase) {
      if (test.#cases === undefined) test.#cases = [];
      test.#cases.push(testCase);
      return this;
    }

    const addOptions = function() {
      this.#options = Object.assign(this.#options, options);
      return this;
    }

    const build = function() {
      console.assert(test.#target !== undefined, 'target undefined');
      console.assert(test.#condition !== undefined, 'condition undefined');
      console.assert(test.#cases !== undefined, 'cases undefined');
      return test;
    }

    return { setTarget, setCondition, addCase, addOptions, build }
  }

  #print() {
    const outcome = this.passed ? 'PASS' : 'FAIL';
    console.log(`[${outcome}] ${this.#target.name}: ${this.passes} passed, ${this.#fails} failed, ${this.#skips} skipped`);
    this.#cases.forEach((c, i) => {
      if ((this.#options.includePass && c.passed)) {
        console.log(`\t${i}: ${c.toString(this.#options.expandPass || this.#options.expand)}`);
      } else if(!c.passed) {
        console.log(`\t${i}: ${c.toString(this.#options.expandFail || this.#options.expand)}`);
      }
    });
  }

  skip() {
    this.#options.skip = true;
  }

  executeAll() {
    this.#cases.forEach(c => {
      if (c.options.skip) { 
        this.#skips++;
        return;
      }
      if (!c.execute(this.#target, this.#condition)) this.#fails++;
    });

    if (this.#options.print) this.#print();
  }
}

export default Test.builder;