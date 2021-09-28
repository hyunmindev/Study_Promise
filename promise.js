export default class Promise {
  #value = null;
  #state = 'pending';
  #child = null;
  #onFulfilledCallbacks = [];
  #onRejectedCallbacks = [];
  #onFinallyCallbacks = [];

  constructor(callback) {
    callback(this.#resolve, this.#reject);
  }

  #resolve = (value) => {
    if (this.#state === 'pending') {
      this.#state = 'fulfilled';
      this.#value = value;
      this.#onFinallyCallbacks.forEach((callback) => callback());
      if (this.#onFulfilledCallbacks.length !== 0) {
        this.#onFulfilledCallbacks.forEach((callback) => callback(value));
      } else {
        this.#child?.#resolve(value);
      }
    }
  };

  #reject = (value) => {
    if (this.#state === 'pending') {
      this.#state = 'rejected';
      this.#value = value;
      this.#onFinallyCallbacks.forEach((callback) => callback());
      if (this.#onRejectedCallbacks.length !== 0) {
        this.#onRejectedCallbacks.forEach((callback) => callback(value));
      } else {
        this.#child?.#reject(value);
      }
    }
  };

  then(callback) {
    this.#child = new Promise((resolve, reject) => {
      if (this.#state === 'pending') {
        this.#onFulfilledCallbacks.push(() => {
          this.#handleCallback(callback, resolve, reject);
        });
      }
      if (this.#state === 'fulfilled') {
        this.#handleCallback(callback, resolve, reject);
      }
      if (this.#state === 'rejected') {
        reject(this.#value);
      }
    });
    return this.#child;
  }

  catch(callback) {
    this.#child = new Promise((resolve, reject) => {
      if (this.#state === 'pending') {
        this.#onRejectedCallbacks.push(() => {
          this.#handleCallback(callback, resolve, reject);
        });
      }
      if (this.#state === 'rejected') {
        this.#handleCallback(callback, resolve, reject);
      }
      if (this.#state === 'fulfilled') {
        resolve(this.#value);
      }
    });
    return this.#child;
  }

  finally(callback) {
    this.#child = new Promise((resolve, reject) => {
      if (this.#state === 'pending') {
        this.#onFinallyCallbacks.push(() => {
          this.#handleCallback(callback, resolve, reject);
        });
      }
      if (this.#state === 'fulfilled' || this.#state === 'rejected') {
        this.#handleCallback(callback, resolve, reject);
      }
    });
    return this.#child;
  }

  #handleCallback(callback, resolve, reject) {
    try {
      const result = callback(this.#value);
      if (result instanceof Promise) {
        if (result.#state === 'fulfilled') {
          result.then(resolve);
        }
        if (result.#state === 'rejected') {
          result.catch(reject);
        }
        if (result.#state === 'pending') {
          result.#onFulfilledCallbacks.push(() => result.then(resolve));
          result.#onRejectedCallbacks.push(() => result.catch(reject));
        }
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  }
}
