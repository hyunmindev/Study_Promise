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
          const result = callback(this.value);
          resolve(result);
        };
      }
      if (this.state === 'fulfilled') {
        const result = callback(this.value);
        resolve(result);
      }
    });
  }

  catch(callback) {
    return new Promise((resolve, reject) => {
      if (this.state === 'pending') {
        this.onRejectedCallback = () => {
          const result = callback(this.value);
          resolve(result);
        };
      }
      if (this.state === 'rejected') {
        const result = callback(this.value);
        resolve(result);
      }
    });
  }
}

function myResolve() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('my resolve'), 1000);
  });
}

myResolve() //
    .then((result) => `next ${result}`) //
    .then((result) => console.log(result)); // next my resolve
