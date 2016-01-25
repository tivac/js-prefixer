js-prefixer [![NPM Version](https://img.shields.io/npm/v/js-prefixer.svg)](https://www.npmjs.com/package/js-prefixer) [![Build Status](https://img.shields.io/travis/tivac/js-prefixer/master.svg)](https://travis-ci.org/tivac/js-prefixer)
===========
<p align="center">
    <a href="https://www.npmjs.com/package/js-prefixer" alt="NPM License"><img src="https://img.shields.io/npm/l/js-prefixer.svg" /></a>
    <a href="https://www.npmjs.com/package/js-prefixer" alt="NPM Downloads"><img src="https://img.shields.io/npm/dm/js-prefixer.svg" /></a>
    <a href="https://david-dm.org/tivac/js-prefixer" alt="Dependency Status"><img src="https://img.shields.io/david/tivac/js-prefixer.svg" /></a>
    <a href="https://david-dm.org/tivac/js-prefixer#info=devDependencies" alt="devDependency Status"><img src="https://img.shields.io/david/dev/tivac/js-prefixer.svg" /></a>
</p>

Prefix relative URLs in JavaScript & JSON code with a cdn URL.

Turns `var a = "/fooga.js";` into `var a = "http://woogabooga.com/fooga.js"`;

## Usage ##

```javascript
var prefixer = require("js-prefixer"),
	code     = "var fooga = \"/googa/nooga.txt\";";

prefixer(
    code,
    { prefix : "//abcdefg123.cloudfront.net" },
    function(err, src) {
        if(err) {
            throw new Error(err);
        }
        
        console.log(src); // writes out: var fooga = "//abcdefg123.cloudfront.net/googa/nooga.txt";
    }
);
```

## API ##

### prefixer(code, [options], cb)

* `code` _{String}_ JS code string
* `options` _{Object}_
* `cb` _{Function}_
  * `err` _{Error | null}_
  * `src` _{String}_ Code with cdn-prefixed URLs

#### Options

* `prefix` _{String}_ URL used to prefix elements.
* `list` _{Array}_ Array of strings to be replaced (will be used instead of scanning for valid-looking URIs)

## Caveats ##

Support for JSON is enabled by prepending it with `var ___jsprefixer___ = ` so it parses as valid JavaScript. This may have unintended side-effects but hasn't been a problem for us in the last year+ of daily usage.
