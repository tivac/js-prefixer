/*jshint node:true */
"use strict";

var fs     = require("fs"),
    assert = require("assert"),

    prefixer = require("../lib/prefixer.js");

describe("JS Prefixer", function() {
    describe("main fn", function() {
        
        it("should handle no options", function(done) {
            prefixer("foo", function(err, code) {
                assert.ifError(err);
                
                assert.equal(code, "foo");
                
                done();
            });
        });
        
        it("should use passed codegen options", function(done) {
            prefixer(
                "var a; //fooga",
                {
                    prefix  : "//f.com",
                    codegen : {
                        comment : false
                    }
                },
                function(err, code) {
                    assert.ifError(err);
                    
                    // NOTE: comments should be removed
                    assert.equal(code, "var a;");
                    
                    done();
                }
            );
        });
        
        it("should return an error on invalid JS", function(done) {
            prefixer(
                fs.readFileSync(
                    "./test/specimens/invalid.js",
                    { encoding : "utf8" }
                ),
                { prefix : "//f.com" },
                function(err, code) {
                    assert(err);
                    
                    done();
                }
            );
        });
        
        it("should update strings & maintain comments", function(done) {
            prefixer(
                fs.readFileSync(
                    "./test/specimens/simple.js",
                    { encoding : "utf8" }
                ),
                { prefix : "//f.com" },
                function(err, code) {
                    assert.ifError(err);
                    
                    assert(code.indexOf("/* woop a boop */") > -1);
                    assert(code.indexOf("//f.com/fooga/booga.js") > -1);
                    assert(code.indexOf("//f.com/nooga.js") > -1);
                    assert(code.indexOf("//f.com/tooga.js") > -1);
                    assert(code.indexOf("\"wooga nooga googa") > -1);
                    
                    done();
                }
            );
        });
    });
});
