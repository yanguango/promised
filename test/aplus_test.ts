import { Promise } from "../src/promise";
declare var require:(moduleId:string) => any;
var promisesAplusTests = require("promises-aplus-tests");

const adapter = {
    deferred() {
        const pending: any = {};
        pending.promise = new Promise((resolver, reject) => {
            pending.resolve = resolver;
            pending.reject = reject;
        });
        return pending;
    }
};
promisesAplusTests(adapter, function (err: any) {
    // All done; output is in the console. Or check `err` for number of failures.
});
