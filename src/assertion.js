class Assertion {
  #summary = undefined;
  #arguments = undefined;
  #expects = undefined;
  #yields = undefined;
  #valid = false;
  #omit = false;

  constructor(summary) {
    console.assert(summary !== undefined, 'string summary expected');
    console.assert(typeof summary === 'string', 'string summary expected');
    console.assert(summary.length, 'non-empty string for summary expected');
    this.#summary = summary;
  }

  get arguments() { return this.#arguments; }
  get expects() { return this.#expects; }
  get yields() { return this.#yields; }
  get valid() { return this.#valid; }
  get omitted() { return this.#omit; }

  static builder(summary, sequent = undefined) {
    const assertion = new Assertion(summary);

    const skip = function() {
      assertion.#omit = true;
      return this;
    }

    const when = function(...args) {
      console.assert(assertion.#arguments === undefined, 'redefining arguments\nfrom: %o\nto: %o', assertion.#arguments, args);
      assertion.#arguments = args;
      return this;
    }

    const then = function(expect) {
      console.assert(assertion.#summary !== undefined, 'summary undefined');
      console.assert(assertion.#arguments !== undefined, 'arguments undefined');
      assertion.#expects = expect;
      console.assert(assertion.#expects !== undefined, 'expected value undefined');


      if (sequent !== undefined) {
        sequent.add(assertion);
        return sequent;
      }
      
      return assertion;
    }

    return { skip, when, then }
  }

  omit() {
    this.#omit = true;
  }

  evaluate(formula, equate) {
    this.#yields = formula(...this.#arguments);
    this.#valid = equate(this.yields, this.expects);
    return this.#valid;
  }

  toString(formula) {
    return  `${this.#valid ? '🟢' : this.#omit ? '🟡' : '🔴'} ` +
            `${this.#omit ? 'omitted' :
            `\x1b[1m${formula.name}(${this.#formatArgsToString()}) ⊢ ${this.#valid ? `${this.#expects}` :
            `\x1b[9m${this.#expects}\x1b[29m ${this.#yields}`
            }`}` + `\x1b[22m\n${this.#summary}`
  }

  print(formula) {
    const options = {
      valid: {
        prefix: '╿',
        func: `\x1b[32m`, // bold, green
        summary: '\x1b[32m', // green
      },
      invalid: {
        prefix: '┿',
        func: `\x1b[31m`, // bold, red
        summary: '\x1b[31m', // red
      },
      omitted: {
        prefix: '┊',
        func: `\x1b[2m`, // dim
        summary: '\x1b[2m', // dim
      },

      cap: '└',
      
      info: [],

      getFnString: function(assertion) {

        const signature = `${formula.name} ( ${assertion.#formatArgsToString()} )`
        let optionSet = this.invalid;

        if (assertion.#valid) {
          optionSet = this.valid;
          return `${optionSet.func}${optionSet.prefix}\x1b[1m ${signature} ⊢ ${assertion.#yields} \x1b[0m`;
        }

        if(assertion.#omit) {
          optionSet = this.omitted;
          return `${optionSet.func}${optionSet.prefix}\x1b[1m ${signature} \x1b[0m`;
        }

        this.info.push(`\x1b[2m${optionSet.summary}${signature} ⊢ ${assertion.#yields}\x1b[0m`);

        return `${optionSet.func}${optionSet.prefix}\x1b[1m ${signature} ⊬ ${assertion.#expects}\x1b[0m`;
      },

      getSummaryString: function(assertion) {

        const lines = this.info.length > 0 ? 
          (() => { 
            this.info.unshift('');
            this.info.push('');
            return this.info.concat(assertion.#summary.split('\n')) 
          })() :
          assertion.#summary.split('\n');

        let optionSet = this.invalid;

        if (assertion.#valid) {
          optionSet = this.valid;
        } else if (assertion.#omit) {
          optionSet = this.omitted;
        }

        return lines.map((line, index) => {
          let prefix = '┊'; 
          if (index === lines.length - 1) prefix = this.cap;
          return `${optionSet.summary}${prefix} ${line} \x1b[0m`;
        });
      }
    };
    
    console.group();
    console.log(options.getFnString(this));
    options.getSummaryString(this).forEach((string) => {
      console.log(string);
    })
    console.groupEnd();
  }

  #formatArgsToString() {
    return this.#arguments.reduce((string, element, index) => {
      if (typeof element === 'string') { 
        return `${string}, ` + `"${element}"`; 
      }

      return `${string}, ` + `${element.toString()}`; 
    });
    
  }
}

export default Assertion.builder;