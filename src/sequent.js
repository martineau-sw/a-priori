import { addSequent } from './a-priori.js'
import Assertion from './assertion.js';
import Printer from './printer.js';

class Sequent {
  #formula = undefined;
  #predicate = undefined;
  #cases = undefined;

  #passes = 0;
  #fails = 0;
  #skips = 0;

  #skipped = false;

  constructor(formula, equate) {
    console.assert(typeof formula === 'function', 'function expected %o', formula);
    console.assert(typeof equate === 'function', 'function with boolean return values expected %o', equate);
    this.#formula = formula;
    this.#predicate = equate;
  }

  get formula() { return this.#formula; }
  get predicate() { return this.#predicate; }
  get cases() { return this.#cases; }

  get passed() { return this.#passes === (this.#cases.length - this.#skips); }
  get failed() { return this.#fails === (this.#cases.length - this.#skips); }
  get skipped() { return this.#skipped; }

  get passes() { return this.#passes; }
  get fails() { return this.#fails; }
  get skips() { return this.#skips; }

  static builder(formula, equate) {
    const sequent = new Sequent(formula, equate);

    const skip = function() { 
      sequent.#skipped = true;
      return this;
    }

    const add = function(assertion) {
      if (sequent.#cases === undefined) sequent.#cases = [];
      sequent.#cases.push(assertion);
    }

    const assert = function(summary) {
      return Assertion(summary, this);
    }

    const end = function() {
      addSequent(sequent);
      return sequent;
    }

    return { add, skip, assert, end }
  }

  skip() {
    this.#skipped = true;
  }

  evaluate() {
    if(this.#skipped) {
      this.print();
      return;
    }

    this.#cases.forEach(c => {
      if (c.skipped) { 
        this.#skips++;
        return;
      }
      if (c.evaluate(this.#formula, this.#predicate)) {
        this.#passes++;
        return;
      } 
      this.#fails++;
    });

    this.print();
  }

  print() {
    const color = this.skipped ? '\x1b[22;2m' : // dimmed
                  this.passed ? '\x1b[39;32m' : // green
                  this.failed ? '\x1b[39;31m' : // red
                                '\x1b[39;33m';  // yellow

    const prefix = color + (this.skipped ? `*` : 
                            this.passed ? `+` :
                            this.failed ? '-' : 
                                          `~`);

    const signature = `${color}\x1b[1m${this.#formula.name}`;
    const passes = this.passes ? `\x1b[22;39;32m${this.passes}` : `\x1b[22;2m-`;
    const fails = this.fails ? `\x1b[22;39;31m${this.fails}` : `\x1b[22;2m-`;
    const skips = `\x1b[39;22;2m` + (this.skips ? `${this.skips}` : `-`);
    
    Printer.enqueue(`${prefix} ${signature}: ${passes} ${fails} ${skips}`);
    // Printer.enqueue(`${color}${this.#formula.name}`)
    Printer.print();
    if(!this.#skipped) this.#cases.forEach(c => c.print(this.#formula.name));
    
  }
}

export default Sequent.builder;