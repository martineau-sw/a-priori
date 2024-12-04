import * as fs from 'fs';

const sequents = [];

export function addSequent(sequent) {
  sequents.push(sequent);
}

export default function run() {
  fs.readdir('./tests/', (err, files) => {
    files.forEach((filename, index) => {
      if (filename.endsWith('.test.js')) {
        import(`../tests/${filename}`).then(() => {
          if (index === files.length - 1) {
          
            sequents.forEach(sequent => {
              if (!sequent.omitted) sequent.evaluate()} 
            );
          }
        });
      }
    })
  })
}

