import run, { importTests } from './src/a-priori.js';
import formulate from './src/sequent.js';
import assert from './src/assertion.js';

// run(process.cwd());
importTests();
run();

export { run, assert, formulate };