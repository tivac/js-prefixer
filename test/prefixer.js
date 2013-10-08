/*jshint node:true */
"use strict";

var fs     = require("fs"),
    assert = require("assert"),

    prefixer = require("../lib/prefixer.js");

describe("JS Prefixer", function() {
    describe("main fn", function() {

        it("should update strings", function(done) {
            prefixer(
                fs.readFileSync(
                    "./test/specimens/simple.js",
                    { encoding : "utf8" }
                ),
                { prefix : "//f.com" },
                function(err, code) {
                    assert.ifError(err);
                    
                    console.log("Simple", code);

                    done();
                }
            );
        });
    });
});
