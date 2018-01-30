'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = {
  Pending: 'Pending',
  Fulfilled: 'Fulfilled',
  Rejected: 'Rejected'
};

var Util = {
  isFunction: function isFunction(val) {
    return val && typeof val === "function";
  },
  isObject: function isObject(val) {
    return val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === "object";
  }
};

var Promise = exports.Promise = function () {
  function Promise(executor) {
    _classCallCheck(this, Promise);

    this._state = State.Pending;
    this._handlers = [];
    this._value = null;
    executor(this._resolve.bind(this), this._reject.bind(this));
  }

  _createClass(Promise, [{
    key: '_resolve',
    value: function _resolve(x) {
      var _this = this;

      if (x === this) {
        throw new TypeError("Resolving object can not be the same object");
      } else if (x instanceof Promise) {
        x.then(this._resolve.bind(this), this._reject.bind(this));
      } else if (Util.isObject(x) || Util.isFunction(x)) {
        var called = false;
        try {
          var thenable = x.then;
          if (Util.isFunction(thenable)) {
            thenable.call(x, function (result) {
              if (!called) _this._resolve(result);
              called = true;
            }, function (error) {
              if (!called) _this._reject(error);
              called = true;
            });
          } else {
            this._fulfill(x);
          }
        } catch (ex) {
          if (!called) {
            this._reject(ex);
          }
        }
      } else {
        this._fulfill(x);
      }
    }
  }, {
    key: '_fulfill',
    value: function _fulfill(result) {
      var _this2 = this;

      this._state = State.Fulfilled;
      this._value = result;
      this._handlers.forEach(function (handler) {
        return _this2._callHandler(handler);
      });
    }
  }, {
    key: '_reject',
    value: function _reject(error) {
      var _this3 = this;

      this._state = State.Rejected;
      this._value = error;
      this._handlers.forEach(function (handler) {
        return _this3._callHandler(handler);
      });
    }
  }, {
    key: '_isPending',
    value: function _isPending() {
      return this._state === State.Pending;
    }
  }, {
    key: '_isFulfilled',
    value: function _isFulfilled() {
      return this._state === State.Fulfilled;
    }
  }, {
    key: '_isRejected',
    value: function _isRejected() {
      return this._state === State.Rejected;
    }
  }, {
    key: '_addHandler',
    value: function _addHandler(onFulfilled, onRejected) {
      this._handlers.push({
        onFulfilled: onFulfilled,
        onRejected: onRejected
      });
    }
  }, {
    key: '_callHandler',
    value: function _callHandler(handler) {
      if (this._isFulfilled() && Util.isFunction(handler.onFulfilled)) {
        handler.onFulfilled(this._value);
      } else if (this._isRejected() && Util.isFunction(handler.onRejected)) {
        handler.onRejected(this._value);
      }
    }
  }, {
    key: 'then',
    value: function then(onFulfilled, onRejected) {
      var _this4 = this;

      switch (this._state) {
        case State.Pending:
          {
            return new Promise(function (resolve, reject) {
              _this4._addHandler(function (value) {
                setTimeout(function () {
                  try {
                    if (Util.isFunction(onFulfilled)) {
                      resolve(onFulfilled(value));
                    } else {
                      resolve(value);
                    }
                  } catch (ex) {
                    reject(ex);
                  }
                }, 0);
              }, function (error) {
                setTimeout(function () {
                  try {
                    if (Util.isFunction(onRejected)) {
                      resolve(onRejected(error));
                    } else {
                      reject(error);
                    }
                  } catch (ex) {
                    reject(ex);
                  }
                }, 0);
              });
            });
          }

        case State.Fulfilled:
          {
            return new Promise(function (resolve, reject) {
              setTimeout(function () {
                try {
                  if (Util.isFunction(onFulfilled)) {
                    resolve(onFulfilled(_this4._value));
                  } else {
                    resolve(_this4._value);
                  }
                } catch (ex) {
                  reject(ex);
                }
              }, 0);
            });
          }

        case State.Rejected:
          {
            return new Promise(function (resolve, reject) {
              setTimeout(function () {
                try {
                  if (Util.isFunction(onRejected)) {
                    resolve(onRejected(_this4._value));
                  } else {
                    reject(_this4._value);
                  }
                } catch (ex) {
                  reject(ex);
                }
              }, 0);
            });
          }
      }
    }
  }]);

  return Promise;
}();