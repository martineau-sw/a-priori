import * as fs from 'fs';
import * as path from 'path';

const sequents = [];

export function importTests() {
  const directory = path.resolve(process.cwd(), 'tests/');
  fs.readdirSync(directory).filter(file => {
    if(!file.endsWith('.test.js')) return;
    import(path.resolve(directory, file)).then(
      () => {
        while(sequents.length) sequents.pop().evaluate();
      }
    );
  });
}

export function addSequent(sequent) {
  sequents.push(sequent);
}

export default function run() {
}

