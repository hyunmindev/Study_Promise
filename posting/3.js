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
    if (this.state === 'pending') {
      this.onFulfilledCallback = callback;
    }
    if (this.state === 'fulfilled') {
      callback(this.value);
    }
    return this;
  }

  catch(callback) {
    if (this.state === 'pending') {
      this.onRejectedCallback = callback;
    }
    if (this.state === 'rejected') {
      callback(this.value);
    }
    return this;
  }
}

function myResolve() {
  return new Promise((resolve, reject) => {
    // resolve('my resolve');
    setTimeout(() => resolve('my resolve'), 1000);
  });
}

myResolve() //
    .then((result) => console.log(result)); // my resolve
