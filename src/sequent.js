import { addSequent } from './a-priori.js'
import Assertion from './assertion.js';

class Sequent {
  #formula = undefined;
  #predicate = undefined;
  #cases = undefined;

  #invalid = 0;
  #omissions = 0;

  #omit = false;

  constructor(formula, equate) {
    console.assert(typeof formula === 'function', 'function expected %o', formula);
    console.assert(typeof equate === 'function', 'function with boolean return values expected %o', equate);
    this.#formula = formula;
    this.#predicate = equate;
  }

  get formula() { return this.#formula; }
  get predicate() { return this.#predicate; }
  get cases() { return this.#cases; }

  get proven() { return this.#invalid === 0; }
  get omitted() { return this.#omit; }

  get valid() { return this.#cases.length - (this.#invalid + this.#omissions); }
  get invalid() { return this.#invalid; }
  get omissions() { return this.#omissions; }

  static builder(formula, equate) {
    const sequent = new Sequent(formula, equate);

    const skip = function() {
      sequent.#omit = true;
      return this;
    }

    const add = function(assertion) {
      if (sequent.#cases === undefined) sequent.#cases = [];
      sequent.#cases.push(assertion);
    }

    const assertion = function(summary) {
      return Assertion(summary, this);
    }

    const end = function() {
      addSequent(sequent);
    }

    return { add, skip, assertion, end }
  }

  toString() {
    let string = '';
    const outcome = this.#invalid === 0 ? '🟢' : '🔴';
    string += ` ${outcome} ${this.#formula.name}: ${this.valid} passed, ${this.#invalid} failed, ${this.#omissions} skipped\n`;
    this.#cases.forEach((c, i) => {
        string += `${' '.repeat(4)}${c.toString(this.#formula)}\n`;
    });

    return string;
  }

  evaluate() {
    this.#cases.forEach(c => {
      if (c.omitted) { 
        this.#omissions++;
        return;
      }
      if (!c.evaluate(this.#formula, this.#predicate)) this.#invalid++;
    });

    this.#print();
  }

  #print() {
    console.group();
    console.log(`${this.#invalid === 0 ? `\x1b[1;32m+` : '\x1b[1;31m-'}` +  
      `\x1b[0;1m${this.#formula.name}:` + 
      `\x1b[1;32m ${this.valid > 0 ? this.valid : '-'}` + 
      `\x1b[0m \x1b[1;31m${this.#invalid > 0 ? this.#invalid : '-'}` + 
      `\x1b[0m \x1b[1;2m${this.#omissions > 0 ? this.#omissions : '-'}\x1b[0m`);
    this.#cases.forEach((c, i) => {
      c.print(this.#formula);
    });
    console.log();
    console.groupEnd();
  }
}

export default Sequent.builder;