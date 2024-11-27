class Assertion {
  #label = undefined;
  #args = undefined;
  #expect = undefined;
  #actual = undefined;
  #pass = false;
  #options = {
    expectFail: false,
    skip: false
  }

  constructor() {
    Object.seal(this.#options);
    Object.seal(this);
  }

  get args() { return this.#args; }
  get expect() { return this.#expect; }
  get passed() { return this.#pass; }
  get actual() { return this.#actual; }
  get options() { return this.#options; }

  static builder() {
    const assertion = new Assertion();

    const setLabel = function(string) {
 
      console.assert(assertion.#label === undefined, 'redefining label\nfrom: %s\nto: %s', assertion.#label, string);
      assertion.#label = string;

      return this;
    }

    const setArgs = function(...args) {
      console.assert(assertion.#args === undefined, 'redefining args\nfrom: %o\nto: %o', assertion.#args, args);
      assertion.#args = args;
      return this;
    }

    const setExpect = function(expect) {
      console.assert(assertion.#expect === undefined, 'redefining expect\nfrom: %o\nto: %o', assertion.#expect, expect);
      assertion.#expect = expect;
      return this;
    }

    const addOptions = function(options) {
      assertion.#options = Object.assign(assertion.#options, options);
      return this;
    }

    const build = function() {
      console.assert(assertion.#label !== undefined, 'label undefined');
      console.assert(assertion.#args !== undefined, 'args undefined');
      console.assert(assertion.#expect !== undefined, 'expect undefined');
      return assertion;
    }

    return { setLabel, setArgs, setExpect, addOptions, build }
  }

  skip() {
    this.#options.skip = true;
  }

  execute(target, condition) {
    this.#actual = target(...this.#args);
    this.#pass = condition.bind(this)();
    return this.#pass;
  }

  toString(expand) {
    return `[${this.#pass ? 'PASS' : this.#options.skip ? 'SKIP' : 'FAIL'}] ` +
           `${this.#label}` +
           (expand && !this.#options.skip ? 
           (`\n\n\targs:\t${JSON.stringify(this.#args)}` +
           `\n\tactual:\t${JSON.stringify(this.#actual)}` +
           `\n\texpect:\t${JSON.stringify(this.#expect)}\n`) : '');
  }
}

export default Assertion.builder;