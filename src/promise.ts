enum State {
  Pending,
  Fulfilled,
  Rejected
}

class Util {
  static isFunction(val: any): boolean {
    return val && typeof val === "function";
  }

  static isObject(val: any): boolean {
    return val && typeof val === "object";
  }
}

export class Promise {
  private _state: State;
  private _value: any;
  private _handlers: any[] = [];

  constructor(executor: (resovle: any, reject: any) => void) {
    this._state = State.Pending;

    executor(this._resolve.bind(this), this._reject.bind(this));
  }

  private _resolve(x: any) {
    if (x === this) {
      throw new TypeError("Resolving object can not be the same object");
    } else if (x instanceof Promise) {
      x.then(this._resolve.bind(this), this._reject.bind(this));
    } else if (Util.isObject(x) || Util.isFunction(x)) {
      let called = false;
      try {
        const thenable = x.then;
        if (Util.isFunction(thenable)) {
          thenable.call(
            x,
            (result: any) => {
              if (!called) this._resolve(result);
              called = true;
            },
            (error: any) => {
              if (!called) this._reject(error);
              called = true;
            }
          );
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

  private _fulfill(result: any) {
    this._state = State.Fulfilled;
    this._value = result;
    this._handlers.forEach(handler => this._callHandler(handler));
  }

  private _reject(error: any) {
    this._state = State.Rejected;
    this._value = error;
    this._handlers.forEach(handler => this._callHandler(handler));
  }

  private _isPending(): boolean {
    return this._state === State.Pending;
  }

  private _isFulfilled(): boolean {
    return this._state === State.Fulfilled;
  }

  private _isRejected(): boolean {
    return this._state === State.Rejected;
  }

  private _addHandler(onFulfilled: any, onRejected: any) {
    this._handlers.push({
      onFulfilled,
      onRejected
    });
  }

  private _callHandler(handler: { onFulfilled: any; onRejected: any }) {
    if (this._isFulfilled() && Util.isFunction(handler.onFulfilled)) {
      handler.onFulfilled(this._value);
    } else if (this._isRejected() && Util.isFunction(handler.onRejected)) {
      handler.onRejected(this._value);
    }
  }

  then(onFulfilled: any, onRejected?: any) {
    switch (this._state) {
      case State.Pending: {
        return new Promise((resolve, reject) => {
          this._addHandler(
            (value: any) => {
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
            },
            (error: any) => {
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
            }
          );
        });
      }

      case State.Fulfilled: {
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

      case State.Rejected: {
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
