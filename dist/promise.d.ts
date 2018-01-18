export declare class Promise {
    private _state;
    private _value;
    private _handlers;
    constructor(executor: (resovle: any, reject: any) => void);
    private _resolve(x);
    private _fulfill(result);
    private _reject(error);
    private _isPending();
    private _isFulfilled();
    private _isRejected();
    private _addHandler(onFulfilled, onRejected);
    private _callHandler(handler);
    then(onFulfilled: any, onRejected?: any): Promise;
}
