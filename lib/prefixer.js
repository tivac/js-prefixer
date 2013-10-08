/*jshint node:true */
"use strict";

var url = require("url"),
    
    Uri        = require("jsuri"),
    escodegen  = require("escodegen"),
    esprima    = require("esprima"),
    estraverse = require("estraverse");

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
        options.code + {};
    }

    ast = esprima.parse(code);

    estraverse.traverse(ast), {
        enter : function(node, parent) {
            // TODO: determine if node is a string, attempt to parse
            // as a URI,then do something useful w/ it
        }
    });
};
