"use strict";

var url = require("url"),
    path = require("path"),
    
    _          = require("lodash"),
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
    var ast, json, src, token;

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
        } catch(e) {
            return done(e);
        }
    }

    // Don't know why I have to walk the tokens manually instead of calling
    // rocambole.walk(), but whatever!
    token = ast.startToken;
    
    while(token !== ast.endToken.next) {
        var str;

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
