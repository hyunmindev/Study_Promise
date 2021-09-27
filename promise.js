export default class Promise {
  get onFulfilledCallbacks() {
    return this.#onFulfilledCallbacks;
  }

  get onRejectedCallbacks() {
    return this.#onRejectedCallbacks;
  }

  get onFinallyCallbacks() {
    return this.#onFinallyCallbacks;
  }

  #value;
  #state;
  #onFulfilledCallbacks = [];
  #onRejectedCallbacks = [];
  #onFinallyCallbacks = [];
  #root;

  constructor(callback, state = 'pending', value = null, root = this) {
    this.#state = state;
    this.#value = value;
    this.#root = root;

    const resolve = (value) => {
      this.#state = 'fulfilled';
      this.#value = value;
      this.#onFulfilledCallbacks.forEach((onFulfilled) => onFulfilled(value));
      this.#onFinallyCallbacks.forEach((onFinally) => onFinally());
    };
    const reject = (value) => {
      this.#state = 'rejected';
      this.#value = value;
      this.#onRejectedCallbacks.forEach((onRejected) => onRejected(value));
      this.#onFinallyCallbacks.forEach((onFinally) => onFinally());
    };
    callback(resolve, reject);
  }

  then(callback) {
    return new Promise((resolve, reject) => {
      if (this.#state === 'pending') {
        this.#root.#onFulfilledCallbacks.push(() => {
          this.#handleCallback(callback, resolve, reject);
        });
      }
      if (this.#state === 'fulfilled') {
        this.#handleCallback(callback, resolve, reject);
      }
    }, this.#state, this.#value, this.#root);
  }

  catch(callback) {
    return new Promise((resolve, reject) => {
      if (this.#state === 'pending') {
        this.#root.#onRejectedCallbacks.push(() => {
          this.#handleCallback(callback, resolve, reject);
        });
      }
      if (this.#state === 'rejected') {
        this.#handleCallback(callback, resolve, reject);
      }
    }, this.#state, this.#value, this.#root);
  }

  finally(callback) {
    return new Promise((resolve, reject) => {
      if (this.#state === 'pending') {
        this.#root.#onFinallyCallbacks.push(() => {
          this.#handleCallback(callback, resolve, reject);
        });
      }
      if (this.#state === 'fulfilled' || this.#state === 'rejected') {
        this.#handleCallback(callback, resolve, reject);
      }
    }, this.#state, this.#value, this.#root);
  }

  #handleCallback(callback, resolve, reject) {
    try {
      const result = callback(this.#value);
      if (result instanceof Promise) {
        result.then(resolve);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  }
}
