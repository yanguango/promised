'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const State = {
  Pending: 'Pending',
  Fulfilled: 'Fulfilled',
  Rejected: 'Rejected'
};

const Util = {
  isFunction(val) {
    return val && typeof val === "function";
  },

  isObject(val) {
    return val && typeof val === "object";
  }
};

class Promise {
  constructor(executor) {
    this._state = State.Pending;
    this._handlers = [];
    this._value = null;
    executor(this._resolve.bind(this), this._reject.bind(this));
  }

  _hasResolved() {
    return this._isFulfilled() || this._isRejected();
  }

  _resolve(x) {
    if (this._hasResolved()) return;

    if (x === this) {
      throw new TypeError("Resolving object can not be the same object");
    } else if (x instanceof Promise) {
      x.then(this._resolve.bind(this), this._reject.bind(this));
    } else if (Util.isObject(x) || Util.isFunction(x)) {
      let called = false;
      try {
        const thenable = x.then;
        if (Util.isFunction(thenable)) {
          thenable.call(x, result => {
            if (!called) this._resolve(result);
            called = true;
          }, error => {
            if (!called) this._reject(error);
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

  _fulfill(result) {
    if (this._hasResolved()) return;

    this._state = State.Fulfilled;
    this._value = result;
    this._handlers.forEach(handler => this._callHandler(handler));
  }

  _reject(error) {
    if (this._hasResolved()) return;

    this._state = State.Rejected;
    this._value = error;
    this._handlers.forEach(handler => this._callHandler(handler));
  }

  _isPending() {
    return this._state === State.Pending;
  }

  _isFulfilled() {
    return this._state === State.Fulfilled;
  }

  _isRejected() {
    return this._state === State.Rejected;
  }

  _addHandler(onFulfilled, onRejected) {
    this._handlers.push({
      onFulfilled,
      onRejected
    });
  }

  _callHandler(handler) {
    if (this._isFulfilled() && Util.isFunction(handler.onFulfilled)) {
      handler.onFulfilled(this._value);
    } else if (this._isRejected() && Util.isFunction(handler.onRejected)) {
      handler.onRejected(this._value);
    }
  }

  then(onFulfilled, onRejected) {
    switch (this._state) {
      case State.Pending:
        {
          return new Promise((resolve, reject) => {
            this._addHandler(value => {
              setTimeout(() => {
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
            }, error => {
              setTimeout(() => {
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
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              try {
                if (Util.isFunction(onFulfilled)) {
                  resolve(onFulfilled(this._value));
                } else {
                  resolve(this._value);
                }
              } catch (ex) {
                reject(ex);
              }
            }, 0);
          });
        }

      case State.Rejected:
        {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              try {
                if (Util.isFunction(onRejected)) {
                  resolve(onRejected(this._value));
                } else {
                  reject(this._value);
                }
              } catch (ex) {
                reject(ex);
              }
            }, 0);
          });
        }
    }
  }
}
exports.Promise = Promise;