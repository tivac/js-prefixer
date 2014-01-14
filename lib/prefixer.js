/*jshint node:true */
"use strict";

var url = require("url"),
    path = require("path"),
    
    _          = require("lodash"),
    escodegen  = require("escodegen"),
    esprima    = require("esprima"),
    estraverse = require("estraverse"),
    
    _prefix   = "var ___jsprefixer___ = ",
    _codegen  = require(path.resolve(__dirname, "../", "codegen.json")),
    _uriRegex = /^(?:\/[\w.-\/]+\.[\w.-]+)$/i,

    _test;

_test = function(src, options) {
    if(!options.list) {
        return _uriRegex.test(src);
    }

    return options.list.indexOf(src) > -1;
};

module.exports = function(code, options, done) {
    var _ast, _json, _src;

    if(typeof options === "function") {
        done = options;
        options = {};
    }

    // No prefix? Nothing to do then
    if(!options.prefix) {
        return done(null, code);
    }

    options.codegen = options.codegen ?
        _.merge({}, _codegen, options.codegen) :
        _.merge({}, _codegen);
    
    try {
        _ast = esprima.parse(code, {
            comment : options.codegen.comment,
            range   : options.codegen.comment,
            tokens  : options.codegen.comment
        });
    } catch(e) {
        // JSON needs to be modified a bit to be parsable
        try {
            _json = true;
            
            code = _prefix + code;
            options.codegen.format.semicolons = false;
            
            _ast = esprima.parse(code, {
                comment : options.codegen.comment,
                range   : options.codegen.comment,
                tokens  : options.codegen.comment
            });
        } catch(e) {
            return done(e);
        }
    }
    
    estraverse.replace(_ast, {
        enter : function(node) {
            if(node.type !== estraverse.Syntax.Literal ||
               typeof node.value !== "string" ||
               !_test(node.value, options)) {
                return;
            }
            
            node.value = url.resolve(options.prefix, node.value);
            node.raw   = "\"" + node.value + "\"";
            
            return node;
        }
    });
    
    if(options.codegen.comment) {
        _ast = estraverse.attachComments(_ast, _ast.comments, _ast.tokens);
    }
    
    _src = escodegen.generate(_ast, options.codegen);
    
    if(_json) {
        _src = _src.replace(_prefix, "");
    }
    
    done(null, _src);
};
