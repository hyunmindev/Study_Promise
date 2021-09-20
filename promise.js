export default class Promise {
  #state = 'pending';
  #value;
  #onResolvedCallbacks = [];
  #onRejectedCallbacks = [];

  constructor(handler) {
    console.log('constructor called');

    const resolve = (value) => {
      console.log('resolve called');
      this.#value = value;
      this.#state = 'resolved';
      this.#onResolvedCallbacks.forEach((callback) => {
        callback(value);
      });
    };

    const reject = (value) => {
      console.log('reject called');
      this.#value = value;
      this.#state = 'rejected';
      this.#onRejectedCallbacks.forEach((callback) => {
        callback(value);
      });
    };

    this.callBack = handler;
    this.callBack(resolve, reject);
  }

  then(onResolved) {
    if (this.#state === 'pending') {
      this.#onResolvedCallbacks.push(onResolved);
    } else if (this.#state === 'resolved') {
      onResolved(this.#value);
    }
    return this;
  }

  catch(onRejected) {
    if (this.#state === 'pending') {
      this.#onRejectedCallbacks.push(onRejected);
    } else if (this.#state === 'rejected') {
      onRejected(this.#value);
    }
    return this;
  }

  finally(callBack) {
    if (this.#state !== 'pending') {
      callBack();
    }
  }
}
