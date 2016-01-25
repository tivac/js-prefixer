"use strict";

var url = require("url"),
    
    rocambole  = require("rocambole"),
    
    _prefix   = "var ___jsprefixer___ = ",
    _uriRegex = /^(?:\/[\w.-\/]+\.[\w.-]+)$/i,

    _test;

_test = function(src, options) {
    if(!options.list) {
        return _uriRegex.test(src);
    }

    return options.list.indexOf(src) > -1;
};

module.exports = function(code, options, done) {
    var ast, json, str, src, token;

    if(typeof options === "function") {
        done = options;
        options = {};
    }

    // No prefix? Nothing to do then
    if(!options.prefix) {
        return done(null, code);
    }

    try {
        ast = rocambole.parse(code);
    } catch(e) {
        // JSON needs to be modified a bit to be parsable
        try {
            json = true;
            
            code = _prefix + code;
            
            ast = rocambole.parse(code);
        } catch(err) {
            return done(err);
        }
    }

    // Don't know why I have to walk the tokens manually instead of calling
    // rocambole.walk(), but whatever!
    token = ast.startToken;

    // No end token? We can't help you
    if(!ast.endToken) {
        return done(null, code);
    }
    
    while(token !== ast.endToken.next) {
        if(token.type === "String") {
            str = token.value.split(/(\'|")/);

            if(_test(str[2], options)) {
                str[2] = url.resolve(options.prefix, str[2]);

                token.value = str.join("");
            }
        }

        token = token.next;
    }
    
    src = ast.toString();
    
    if(json) {
        src = src.replace(_prefix, "");
    }
    
    done(null, src);
};
