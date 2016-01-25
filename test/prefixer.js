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
        
        it("should return an error on invalid JS", function(done) {
            prefixer(
                fs.readFileSync("./test/specimens/invalid.js", "utf8"),
                { prefix : "//f.com" },
                function(err) {
                    assert(err);
                    
                    done();
                }
            );
        });

        it("should work on empty files", function(done) {
            prefixer(
                fs.readFileSync("./test/specimens/empty.js", "utf8"),
                { prefix : "//f.com" },
                function(err, code) {
                    assert.ifError(err);
                    
                    assert(code.length === 0);

                    done();
                }
            );
        });
        
        it("should update strings & maintain comments", function(done) {
            prefixer(
                fs.readFileSync("./test/specimens/simple.js", "utf8"),
                { prefix : "//f.com" },
                function(err, code) {
                    assert.ifError(err);
                    
                    assert(code.indexOf("/* woop a boop */") > -1);
                    
                    assert(code.indexOf("//f.com/fooga/booga.js") > -1);
                    assert(code.indexOf("//f.com/tooga.js") > -1);
                    
                    assert(code.indexOf("\"nooga.js") > -1);
                    assert(code.indexOf("\"wooga nooga googa") > -1);
                    
                    done();
                }
            );
        });
        
        it("should update strings in complex JS", function(done) {
            prefixer(
                fs.readFileSync("./test/specimens/complex.js", "utf8"),
                { prefix : "//f.com" },
                function(err, code) {
                    assert.ifError(err);
                    
                    assert(code.indexOf("vb = \"//f.com/fooga.js\"") > -1);
                    assert(code.indexOf("n.url = \"http://g.com/vooga\";") > -1);
                    
                    done();
                }
            );
        });
        
        it("should update strings in JSON", function(done) {
            prefixer(
                fs.readFileSync("./test/specimens/simple.json", "utf8"),
                { prefix : "//f.com" },
                function(err, code) {
                    assert.ifError(err);
                    
                    assert.doesNotThrow(
                        function() {
                            JSON.parse(code);
                        }
                    );
                    
                    assert(code.indexOf("//f.com/wooga.js") > -1);
                    assert(code.indexOf("//f.com/rooga/dooga/vooga.txt") > -1);
                    
                    assert(code.indexOf("\"tooga") > -1);
                    assert(code.indexOf("\"nooga.js") > -1);
                    
                    done();
                }
            );
        });
        
        it("should update strings in complex JSON", function(done) {
            prefixer(
                fs.readFileSync("./test/specimens/complex.json", "utf8"),
                { prefix : "//f.com" },
                function(err, code) {
                    assert.ifError(err);
                    
                    assert.doesNotThrow(
                        function() {
                            JSON.parse(code);
                        }
                    );
                    
                    assert(code.indexOf("//f.com/wooga.js") > -1);
                    assert(code.indexOf("//f.com/rooga/dooga/vooga.txt") > -1);
                    
                    assert(code.indexOf("\"tooga") > -1);
                    assert(code.indexOf("\"nooga.js") > -1);
                    
                    done();
                }
            );
        });

        it("should only update items that exist in the list", function(done) {
            prefixer(
                fs.readFileSync("./test/specimens/simple.js", "utf8"),
                { prefix : "//f.com", list : [ "/fooga/booga.js" ] },
                function(err, code) {
                    assert(code.indexOf("//f.com/fooga/booga.js") > -1);
                    
                    assert(code.indexOf("\"nooga.js") > -1);
                    assert(code.indexOf("\"/tooga.js") > -1);

                    done();
                }
            );
        });
    });
});
