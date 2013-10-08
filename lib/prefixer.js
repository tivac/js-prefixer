/*jshint node:true */
"use strict";

var url = require("url"),
    
    Uri        = require("jsuri"),
    escodegen  = require("escodegen"),
    esprima    = require("esprima"),
    estraverse = require("estraverse"),

    _matcher = /[^\w.-]/;

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

    estraverse.replace(ast, {
        enter : function(node, parent) {
            var uri;

            // TODO: determine if node is a string, attempt to parse
            // as a URI,then do something useful w/ it
            //console.log(node);

            if(node.type !== estraverse.Syntax.Literal) {
                return;
            }
            
            uri = new Uri(node.value);

            console.log(uri);
            console.log(url.parse(node.value, false, true));
        }
    });
};
