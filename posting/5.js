class Promise {
  constructor(callback) {
    this.state = 'pending';
    this.onFulfilledCallback = null;
    this.onRejectedCallback = null;

    const resolve = (value) => {
      this.state = 'fulfilled';
      this.value = value;
      if (this.onFulfilledCallback !== null) {
        this.onFulfilledCallback(value);
      }
    };
    const reject = (value) => {
      this.state = 'rejected';
      this.value = value;
      if (this.onRejectedCallback !== null) {
        this.onRejectedCallback(value);
      }
    };
    callback(resolve, reject);
  }

  then(callback) {
    return new Promise((resolve, reject) => {
      if (this.state === 'pending') {
        this.onFulfilledCallback = () => {
          this.handleCallback(callback, resolve);
        };
      }
      if (this.state === 'fulfilled') {
        this.handleCallback(callback, resolve);
      }
    });
  }

  catch(callback) {
    return new Promise((resolve, reject) => {
      if (this.state === 'pending') {
        this.onRejectedCallback = () => {
          this.handleCallback(callback, resolve);
        };
      }
      if (this.state === 'rejected') {
        this.handleCallback(callback, resolve);
      }
    });
  }

  handleCallback(callback, resolve, reject) {
    const result = callback(this.value);
    if (result instanceof Promise) { // 🌟
      result.then(resolve);
    } else {
      resolve(result);
    }
  }
}

function myResolve() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('my resolve'), 1000);
  });
}

myResolve() //
    .then((result) => `next ${result}`) //
    .then((result) => console.log(result)); // next my resolve
