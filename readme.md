JS Prefixer
==========

Prefix relative URLs in JavaScript code with a cdn URL

[![Build Status](https://travis-ci.org/tivac/node-js-prefixer.png?branch=master)](https://travis-ci.org/tivac/node-js-prefixer)
[![NPM version](https://badge.fury.io/js/js-prefixer.png)](http://badge.fury.io/js/js-prefixer)
[![Dependency Status](https://gemnasium.com/tivac/node-js-prefixer.png)](https://gemnasium.com/tivac/node-js-prefixer)

## Usage ##

```javascript
var prefixer = require("js-prefixer");

prefixr(code, { prefix : "//abcdefg123.cloudfront.net" }, function(err, src) {
    if(err) {
        throw new Error(err);
    }
    
    console.log(src);
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
* `codegen` _{Object}_ escodegen options (see `./codegen.json` for defaults & [escodegen docs](https://github.com/Constellation/escodegen/wiki/API#options) for descriptions)
