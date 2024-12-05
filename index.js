import run, { importTests } from './src/a-priori.js';
import formulate from './src/test.js';
import assert from './src/assertion.js';

importTests();
run();

export default formulate;