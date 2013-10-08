/*jshint node:true */
"use strict";

var url = require("url"),
    
    escodegen  = require("escodegen"),
    esprima    = require("esprima"),
    estraverse = require("estraverse"),
    
    _test = /^(?:[\w.-]+\.[\w.-]+)|(?:\/[\w.-\/]+\.[\w.-]+)$/i;

module.exports = function(code, options, done) {
    var ast;

    if(typeof options === "function") {
        done = options;
        options = {};
    }

    // No prefix? Nothing to do then
    if(!options.prefix) {
        return done(null, code);
    }

    if(!options.code) {
        options.code = {};
    }

    ast = esprima.parse(code);

    estraverse.replace(ast, {
        enter : function(node) {
            if(node.type !== estraverse.Syntax.Literal ||
               !_test.test(node.value)) {
                return;
            }
            
            node.value = url.resolve(options.prefix, node.value);
            
            return node;
        }
    });
    
    // TODO: regenerate JS from ast using options.code as the escodegen options
    // TODO: call done w/ new source
};
