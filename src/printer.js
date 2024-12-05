

class Printer {
  static buffer = [];

  static enqueue(string) {
    this.buffer.push(string);
  }

  static print(indentLevel = 0) {
    const indent = '  '.repeat(indentLevel);
    while(this.buffer.length){
      console.log(`${indent}${this.buffer.shift()}`);
    }
  }
}


export default Printer;