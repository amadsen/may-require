const resolveFrom = require('resolve-from');
const callingFile = require('calling-file');
const trike = require('trike');

const mayRequire = (opts, ...args) => {
  if ('string' === typeof opts) {
    return mayRequire({})(opts, ...args);
  }

  if (args.length > 0) {
    return mayRequire(opts)(...args);
  }

  const from = opts.from || callingFile({ dir: true });

  return (moduleId) => {        
    const [err, id] = trike(resolveFrom, from, moduleId);
    if (err) {
      return [err];
    }

    const stash = require.cache[id];
    if (opts.reload) {
      delete require.cache[id];            
    }
    const moduleResult = trike(require, id);
    if (opts.reload && stash) {
      require.cache[id] = stash;            
    }
    return moduleResult;
  };
};

module.exports = mayRequire;
