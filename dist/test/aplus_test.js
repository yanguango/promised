"use strict";

var _promise = require("../src/promise");

var promisesAplusTests = require("promises-aplus-tests");

var adapter = {
    deferred: function deferred() {
        var pending = {};
        pending.promise = new _promise.Promise(function (resolver, reject) {
            pending.resolve = resolver;
            pending.reject = reject;
        });
        return pending;
    }
};
promisesAplusTests(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});