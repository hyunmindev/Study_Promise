class Promise {
  constructor(callback) {
    this.state = 'pending';
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      this.state = 'fulfilled';
      this.value = value;
      this.onFulfilledCallbacks.forEach((callback) => callback(value));
    };
    const reject = (value) => {
      this.state = 'rejected';
      this.value = value;
      this.onRejectedCallbacks.forEach((callback) => callback(value));
    };
    callback(resolve, reject);
  }

  then(callback) {
    if (this.state === 'pending') {
      this.onFulfilledCallbacks.push(callback);
    }
    if (this.state === 'fulfilled') {
      callback(this.value);
    }
    return this;
  }

  catch(callback) {
    if (this.state === 'pending') {
      this.onRejectedCallbacks.push(callback);
    }
    if (this.state === 'rejected') {
      callback(this.value);
    }
    return this;
  }
}

function myResolve() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('my resolve'), 1000);
  });
}

function myReject() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('my reject'), 1000);
  });
}

myResolve() //
    .then((result) => console.log(0, result)) // my resolve
    .catch((result) => console.log(result)); //

myReject() //
    .then((result) => console.log(result)) //
    .catch((result) => console.log(result)); // my reject
