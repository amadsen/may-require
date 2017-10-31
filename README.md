# May-Require

Sometimes you need to `require()` an optional dependency. If it can be loaded, you want to use it. Otherwise, you have other plans. Unfortunately, `require()` throws if it can't load a module. For an optional dependency that's just awkward.

## Installation

~~~bash
npm install may-require
~~~

## Use

The prmary use case of `may-require` is to hold off on throwing any errors loading modules until we've had a chance to decide if we care:

~~~javascript
...
// true, indicating the default watchers
if (w === true) {
    const [e1, nsfw] = mayRequire('./lib/watchers/nsfw.js');
    const [e2, sane] = mayRequire('./lib/watchers/sane.js');
    const w = nsfw || sane;
    if (!w) {
        let err = new Error('Unable to provide a default file watcher.');
        err.chain = [e1, e2];
        throw err;
    }
    return w;
}
// false means no watchers
return false;
...
~~~

By default, modules are required from the context of the calling file's directory - just like `require()` normally works. However, `may-require` allows you to specify a directory to require "from" if you need to:

~~~javascript
const [err, watcher] = mayRequire({
    from: process.cwd()
})('watcher');

if (err) {
    // why did we optionally require?
    throw err;
}

return watcher;
~~~

`may-require` also allows you to "reload" modules

~~~javascript
const [e1, clone1] = mayRequire({
    reload: true
})('clone-me');
const [e2, clone2] = mayRequire({
    reload: true
})('clone-me');

if (clone1 !== clone2) {
	console.log('They look the same, but are not the same.');
}
~~~

### mayRequire(options)

Returns a function which will optionally `require()` a module using the supplied options. This is useful if you'd like to optionally require more than one module using the same options.

### mayRequire(moduleId)

Optionally `require()`s the moduleId using the default options.

### mayRequire(options, moduleId)

Optionally `require()`s the moduleId using the specified options.

#### options

##### from

The directory path from which to resolve the `moduleId`. This is particularly relevant for relative local module paths, but may also impact which `node_modules` folders are checked.

##### reload

A flag indicating whether a cached version of the module _should be ignored_ and a new copy loaded.

## Similar modules

+ [optional](https://www.npmjs.com/package/optional) - requires relative modules in the context of `process.cwd()`. Returns `null` for errors that are not rethrown by specifying an option.
+ [optional-require](https://www.npmjs.com/package/optional-require) - pass it `require` and get back a function that optionally requires from your module. Errors can be handled via callback options.
+ [tyr-require](https://www.npmjs.com/package/try-require) - optionally takes `require` as a second parameter. Errors must be obtained through `tryRequire.lastError()`.

## License

Copyright (c) 2017 Aaron Madsen

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.