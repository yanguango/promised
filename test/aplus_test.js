import { Promise } from "../src/promise";

var promisesAplusTests = require("promises-aplus-tests");

const adapter = {
    deferred() {
        const pending = {};
        pending.promise = new Promise((resolver, reject) => {
            pending.resolve = resolver;
            pending.reject = reject;
        });
        return pending;
    }
};
promisesAplusTests(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});
