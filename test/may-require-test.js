const test = require('tape');
const path = require('path');

const mayRequire = require('../');
const supportModule = require('./support/a-module');

test(
  'Should return error as first array element if unable to load module',
  (t) => {
    const [err, ...rest] = mayRequire('./does/not/exist');
    t.ok(err instanceof Error, 'Error returned in first array element');

    t.end()
  }
);

test(
  'Should return module as second array element',
  (t) => {
    const [err, aModule] = mayRequire('./support/a-module.js');
    t.equals(err, null, 'Error (first array element) is null');
    t.equals(aModule, supportModule, 'Expected module found');
    t.pass('module paths are relative to calling file by default');

    t.end()
  }
);

test(
  'Should allow specifying the directory to require from',
  (t) => {
    const [err, aModule] = mayRequire({
        from: path.join(__dirname, 'support')
      },
      './a-module.js'
    );
    t.equals(err, null, 'Error (first array element) is null');
    t.equals(aModule, supportModule, 'Expected module found');
    t.pass('module paths are relative to specified \'from\' path');

    t.end()
  }
);

test(
  'Should reload a new module from disk if opts.reload is true',
  (t) => {
    const [err, aModule] = mayRequire(
      {
        reload: true
      },
      './support/a-module.js'
    );
    t.equals(err, null, 'Error (first array element) is null');
    t.notEquals(aModule, supportModule, 'modules are not the same object');
    t.deepEquals(aModule, supportModule, 'modules have the same structure');

    t.end()
  }
);

