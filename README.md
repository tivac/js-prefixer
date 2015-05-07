js-prefixer
==========
[![Build Status](https://travis-ci.org/tivac/node-js-prefixer.png?branch=master)](https://travis-ci.org/tivac/node-js-prefixer) [![NPM version](https://badge.fury.io/js/js-prefixer.png)](http://badge.fury.io/js/js-prefixer) [![Dependency Status](https://gemnasium.com/tivac/node-js-prefixer.png)](https://gemnasium.com/tivac/node-js-prefixer)

Prefix relative URLs in JavaScript & JSON code with a cdn URL.

Turns `var a = "/fooga.js";` into `var a = "http://woogabooga.com/fooga.js"`;

## Usage ##

```javascript
var prefixer = require("js-prefixer"),
	code     = "var fooga = \"/googa/nooga.txt\";";

prefixer(code, { prefix : "//abcdefg123.cloudfront.net" }, function(err, src) {
    if(err) {
        throw new Error(err);
    }
    
    console.log(src); // writes out: var fooga = "//abcdefg123.cloudfront.net/googa/nooga.txt";
});
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
