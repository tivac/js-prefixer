JS Prefixer
==========

Prefix relative URLs in JavaScript code with a cdn URL

[![Build Status](https://travis-ci.org/tivac/node-js-prefixer.png?branch=master)](https://travis-ci.org/tivac/node-js-prefixer)
[![NPM version](https://badge.fury.io/js/js-prefixer.png)](http://badge.fury.io/js/js-prefixer)
[![Dependency Status](https://gemnasium.com/tivac/node-js-prefixer.png)](https://gemnasium.com/tivac/node-js-prefixer)

## Usage ##

```javascript
var prefixer = require("js-prefixer");

prefixr(code, { prefix : "//abcdefg123.cloudfront.net" }, function(err, text) {
    if(err) {
        throw new Error(err);
    }
    
    console.log(text.toString("utf8"));
});
```

## API ##

### prefixer(code, [options], cb)

* `code` {String} JS code string
* `options` {Object}
* `cb` {Function}
  * `err` {Error | null}
  * `text` {String} Rewritten text

#### Options

* `prefix` {String} URL used to prefix elements.
