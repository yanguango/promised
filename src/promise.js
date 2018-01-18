"use strict";
exports.__esModule = true;
var State;
(function (State) {
    State[State["Pending"] = 0] = "Pending";
    State[State["Fulfilled"] = 1] = "Fulfilled";
    State[State["Rejected"] = 2] = "Rejected";
})(State || (State = {}));
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.isFunction = function (val) {
        return val && typeof val === "function";
    };
    Util.isObject = function (val) {
        return val && typeof val === "object";
    };
    return Util;
}());
var Promise = /** @class */ (function () {
    function Promise(executor) {
        this._handlers = [];
        this._state = State.Pending;
        executor(this._resolve.bind(this), this._reject.bind(this));
    }
    Promise.prototype._resolve = function (x) {
        var _this = this;
        if (this._isFulfilled() || this._isRejected())
            return;
        if (x === this) {
            throw new TypeError("Resolving object can not be the same object");
        }
        else if (x instanceof Promise) {
            x.then(this._resolve.bind(this), this._reject.bind(this));
        }
        else if (Util.isObject(x) || Util.isFunction(x)) {
            var called_1 = false;
            try {
                var thenable = x.then;
                if (Util.isFunction(thenable)) {
                    thenable.call(x, function (result) {
                        _this._resolve(result);
                        called_1 = true;
                    }, function (error) {
                        _this._reject(error);
                        called_1 = true;
                    });
                }
                else {
                    this._fulfill(x);
                }
            }
            catch (ex) {
                if (!called_1) {
                    this._reject(ex);
                }
            }
        }
        else {
            this._fulfill(x);
        }
    };
    Promise.prototype._fulfill = function (result) {
        var _this = this;
        this._state = State.Fulfilled;
        this._value = result;
        this._handlers.forEach(function (handler) { return _this._callHandler(handler); });
        this._handlers = [];
    };
    Promise.prototype._reject = function (error) {
        var _this = this;
        this._state = State.Rejected;
        this._value = error;
        this._handlers.forEach(function (handler) { return _this._callHandler(handler); });
        this._handlers = [];
    };
    Promise.prototype._isPending = function () {
        return this._state === State.Pending;
    };
    Promise.prototype._isFulfilled = function () {
        return this._state === State.Fulfilled;
    };
    Promise.prototype._isRejected = function () {
        return this._state === State.Rejected;
    };
    Promise.prototype._addHandler = function (onFulfilled, onRejected) {
        this._handlers.push({
            onFulfilled: onFulfilled,
            onRejected: onRejected
        });
    };
    Promise.prototype._callHandler = function (handler) {
        if (this._isFulfilled() && Util.isFunction(handler.onFulfilled)) {
            handler.onFulfilled(this._value);
        }
        else if (this._isRejected() && Util.isFunction(handler.onRejected)) {
            handler.onRejected(this._value);
        }
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        switch (this._state) {
            case State.Pending: {
                return new Promise(function (resolve, reject) {
                    _this._addHandler(function (value) {
                        setTimeout(function () {
                            try {
                                if (Util.isFunction(onFulfilled)) {
                                    resolve(onFulfilled(value));
                                }
                                else {
                                    resolve(value);
                                }
                            }
                            catch (ex) {
                                reject(ex);
                            }
                        }, 0);
                    }, function (error) {
                        setTimeout(function () {
                            try {
                                if (Util.isFunction(onRejected)) {
                                    resolve(onRejected(error));
                                }
                                else {
                                    reject(error);
                                }
                            }
                            catch (ex) {
                                reject(ex);
                            }
                        }, 0);
                    });
                });
            }
            case State.Fulfilled: {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        try {
                            if (Util.isFunction(onFulfilled)) {
                                resolve(onFulfilled(_this._value));
                            }
                            else {
                                resolve(_this._value);
                            }
                        }
                        catch (ex) {
                            reject(ex);
                        }
                    }, 0);
                });
            }
            case State.Rejected: {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        try {
                            if (Util.isFunction(onRejected)) {
                                resolve(onRejected(_this._value));
                            }
                            else {
                                reject(_this._value);
                            }
                        }
                        catch (ex) {
                            reject(ex);
                        }
                    }, 0);
                });
            }
        }
    };
    return Promise;
}());
exports.Promise = Promise;
var s = 0;
console.log(s);
