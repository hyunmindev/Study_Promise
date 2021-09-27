class Promise {
  #value = null;
  #state = 'pending';
  #onFulfilledCallbacks = [];
  #onRejectedCallbacks = [];
  #onCallbacks = [];

  constructor(callback) {
    const resolve = (value) => {
      this.#state = 'fulfilled';
      this.#value = value;
      this.#onFulfilledCallbacks.forEach((callback) => callback(value));
      this.#onCallbacks.forEach((callback) => callback());
    };
    const reject = (value) => {
      this.#state = 'rejected';
      this.#value = value;
      this.#onRejectedCallbacks.forEach((callback) => callback(value));
      this.#onCallbacks.forEach((callback) => callback());
    };
    callback(resolve, reject);
  }

  then(callback) {
    return new Promise((resolve, reject) => {
      if (this.#state === 'pending') {
        this.#onFulfilledCallbacks.push(() => {
          this.#handleCallback(callback, resolve, reject);
        });
      }
      if (this.#state === 'fulfilled') {
        this.#handleCallback(callback, resolve, reject);
      }
    });
  }

  catch(callback) {
    return new Promise((resolve, reject) => {
      if (this.#state === 'pending') {
        this.#onRejectedCallbacks.push(() => {
          this.#handleCallback(callback, resolve, reject);
        });
      }
      if (this.#state === 'rejected') {
        this.#handleCallback(callback, resolve, reject);
      }
    });
  }

  finally(callback) {
    return new Promise((resolve, reject) => {
      if (this.#state === 'pending') {
        this.#onCallbacks.push(() => {
          this.#handleCallback(callback, resolve, reject);
        });
      }
      if (this.#state === 'fulfilled' || this.#state === 'rejected') {
        this.#handleCallback(callback, resolve, reject);
      }
    });
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

function myResolve() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('my resolve'), 1000);
  });
}

function myNextResolve(result) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`next ${result}`), 1000);
  });
}

myResolve() //
    .then((result) => {
      console.log(result);
      return myNextResolve();
    }) //
    .then((result) => {
      console.log(result);
    }) //
    .finally(() => {
      console.log('finally called');
      return myNextResolve('finally promise');
    }) //
    .then((result) => {
      console.log(result);
      return myNextResolve('after');
    }) //
    .then((result) => {
      console.log('result', result);
    }) //
    .finally(() => {
      console.log('second finally');
      throw 'last error';
    }) //
    .catch((error) => {
      console.log(error);
    });
