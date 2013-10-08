/*jshint node:true */
"use strict";

var url = require("url"),
    path = require("path"),
    
    _          = require("lodash"),
    escodegen  = require("escodegen"),
    esprima    = require("esprima"),
    estraverse = require("estraverse"),
    
    _codegen = require(path.resolve(__dirname, "../", "codegen.json")),
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

    options.codegen = options.codegen ? _.merge({}, _codegen, options.codegen) : _codegen;
    
    try {
        ast = esprima.parse(code, {
            comment : options.codegen.comment,
            range   : options.codegen.comment,
            tokens  : options.codegen.comment
        });
    } catch(e) {
        return done(e);
    }
    
    estraverse.replace(ast, {
        enter : function(node) {
            if(node.type !== estraverse.Syntax.Literal ||
               !_test.test(node.value)) {
                return;
            }
            
            node.value = url.resolve(options.prefix, node.value);
            node.raw   = "\"" + node.value + "\"";
            
            return node;
        }
    });
    
    if(options.codegen.comment) {
        ast = estraverse.attachComments(ast, ast.comments, ast.tokens);
    }
    
    done(null, escodegen.generate(ast, options.codegen));
};
