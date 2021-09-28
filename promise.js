export default class Promise {
  #value = null;
  #state = 'pending';
  #child = null;
  #onFulfilledCallback = null;
  #onRejectedCallback = null;
  #onFinallyCallback = () => {};

  constructor(callback) {
    callback(this.#resolve, this.#reject);
  }

  #resolve = (value) => {
    if (this.#state === 'pending') {
      this.#state = 'fulfilled';
      this.#value = value;
      this.#onFinallyCallback();
      if (this.#onFulfilledCallback !== null) {
        this.#onFulfilledCallback(value);
      } else {
        this.#child?.#resolve(value);
      }
    }
  };

  #reject = (value) => {
    if (this.#state === 'pending') {
      this.#state = 'rejected';
      this.#value = value;
      this.#onFinallyCallback();
      if (this.#onRejectedCallback !== null) {
        this.#onRejectedCallback();
      } else {
        this.#child?.#reject(value);
      }
    }
  };

  then(callback) {
    this.#child = new Promise((resolve, reject) => {
      if (this.#state === 'pending') {
        this.#onFulfilledCallback = () => {
          this.#handleCallback(callback, resolve, reject);
        };
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
        this.#onRejectedCallback = () => {
          this.#handleCallback(callback, resolve, reject);
        };
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
        this.#onFinallyCallback = () => {
          this.#handleCallback(callback, resolve, reject);
        };
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
          result.#onFulfilledCallback = () => result.then(resolve);
          result.#onRejectedCallback = () => result.catch(reject);
        }
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  }
}
