import path from 'node:path';

import {execute} from './execute.js';
import {prependPathIfItExists} from './utils.js';

const cwd = process.cwd(); 
const depotToolsPath = path.join(cwd, 'third_party', 'depot_tools');
prependPathIfItExists(depotToolsPath);

async function main() {
  try {
    await execute('git', ['submodule', 'update', '--init']);

    process.chdir('third_party/depot_tools');
    await execute('git', ['pull', 'origin', 'main']);
    process.chdir(cwd);

    process.chdir('third_party/dawn');
    await execute('git', ['pull', 'origin', 'main']);
    await execute('gclient', ['sync', '-D']);
    process.chdir(cwd);

   } catch (e) {
    console.error(e);
    console.error(e.stack);
    process.exit(1);
  }
}

main();