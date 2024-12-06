import Printer from "./printer.js";

export class Assertion {
  #summary = undefined;
  #args = undefined;
  #expect = undefined;
  #actual = undefined;
  #passed = false;
  #skipped = false;

  constructor(summary) {
    console.assert(summary !== undefined, 'string summary expected');
    console.assert(typeof summary === 'string', 'string summary expected');
    console.assert(summary.length, 'non-empty string for summary expected');
    this.#summary = summary;
  }

  get args() { return this.#args; }
  get expect() { return this.#expect; }
  get actual() { return this.#actual; }
  get passed() { return this.#passed; }
  get failed() { return !this.#passed && !this.#skipped; }
  get skipped() { return this.#skipped; }

  static builder(summary, sequent = undefined) {
    const assertion = new Assertion(summary);

    const skip = function() {
      assertion.#skipped = true;
      return this;
    }

    const when = function(...args) {
      console.assert(assertion.#args === undefined, 'redefining args\nfrom: %o\nto: %o', assertion.#args, args);
      assertion.#args = args;
      return this;
    }

    const then = function(expect) {
      console.assert(assertion.#summary !== undefined, 'summary undefined');
      console.assert(assertion.#args !== undefined, 'args undefined');
      assertion.#expect = expect;
      console.assert(assertion.#expect !== undefined, 'expected value undefined');


      if (sequent !== undefined) {
        sequent.add(assertion);
        return sequent;
      }
      
      return assertion;
    }

    return { skip, when, then }
  }

  skip() {
    this.#skipped = true;
  }

  evaluate(formula, equate) {
    this.#actual = formula(...this.#args);
    this.#passed = equate(this.actual, this.expect);
    return this.#passed;
  }

  print(formula) {
    const color = this.passed ? '\x1b[22;39;32m' :
                  this.failed ? '\x1b[22;39;31m' :
                                '\x1b[22;39;2m'; 

    if (!formula.length) formula = formula.toString();

    this.#headString(formula, color);
    this.#bodyString(formula, color);
    this.#footString(color);

    Printer.print(1);
  }

  #headString(formula, color) {
    const prefix = this.passed ? `╿` : 
                  (this.failed ? `┯` : 
                                 `╤`);
    const lines = [];
    const signature = `${color}${prefix} ${this.#skipped ? '\x1b[22;2m' : '\x1b[22;1m'}${formula}`; 
    const args = this.#argsToString('36');
    const op = '\x1b[22m' + (this.#passed ? '=' : '≠');
    const expect = `\x1b[1m${this.#stringifyValue(this.#expect)}`;
    const result = this.#skipped ? '' : `${color}${op} ${expect}`;

    const string = `${signature} ( ${args}\x1b[1m ) ${result}`;

    let i = 0;
    let found = string.indexOf('\n');
    while (found !== -1) {
      if (i === 0) {
        lines.push(string.slice(0, found));
      } else {
        lines.push(color + '\x1b[22m│   \x1b[1m' + string.slice(i + 1, found));
      }
      i = found;
      found = string.indexOf('\n', found + 1);
    }
    lines.push('\x1b[22m│   \x1b[1m' + string.slice(i + 1, string.length));

    

    lines.forEach(line => { Printer.enqueue(line) });
  }

  #bodyString(formula, color) {
    if (!this.failed) return;

    const signature = `${color}┊ \x1b[22;2m${formula}`
    const args = this.#argsToString('35;2');
    const op = `\x1b[22;2m=`;
    const actual = `\x1b[1;2m${this.#stringifyValue(this.#actual)}`;

    const string = `${signature}(${args}\x1b[2m) ${op} \x1b[35m${actual}`

    const lines = [];
    lines.push(`\x1b[22m┊`);
    let i = 0;
    let found = string.indexOf('\n');
    while (found !== -1) {
      if (i === 0) {
        lines.push(string.slice(0, found));
      } else {
        lines.push(color + '\x1b[22m┊ \x1b[2m' + string.slice(i + 1, found));
      }
      i = found;
      found = string.indexOf('\n', found + 1);
    }

    lines.push('\x1b[22m┊ \x1b[2m' + string.slice(i + 1, string.length));
    lines.push(`${color}┊`)
    
    lines.forEach(line => { Printer.enqueue(line) });

  }

  #footString(color) {
    Printer.enqueue(`${color}└ ${this.#summary}\x1b[39;22m`);
  }

  #argsToString(codes) {
    let string = ``;
    this.#args.forEach((arg, index) => {
      let argString = this.#stringifyValue(arg);
      argString = `\x1b[22;39;${codes}m${argString}\x1b[39m`;
      if (argString.length > 40) argString = '\n  ' + argString;
      if (index > 0)
        argString = `, ${argString}`;
      if (index === this.#args.length - 1) {
        if (this.passed) argString += `\x1b[32m`
        else if (this.failed) argString += `\x1b[31m`;
        else argString += `\x1b[2m`;
      }
      string += argString;
    });
    return string;
    
  }

  #stringifyValue(value) {
    switch(typeof value) {
      case 'object': return '\n' + JSON.stringify(value, null, 2).replaceAll(/(?<=\s)(?<!:\s)"|"(?=:)/gm, '');
      case 'string': return `'${value}'`;
      return `${value}`;
    }
  }
}

export default Assertion.builder;