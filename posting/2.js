class Promise {
  constructor(callback) {
    this.state = 'pending';

    const resolve = (value) => {
      this.state = 'fulfilled';
      this.value = value;
    };
    const reject = (value) => {
      this.state = 'rejected';
      this.value = value;
    };
    callback(resolve, reject);
  }

  then(callback) {
    if (this.state === 'fulfilled') {
      callback(this.value);
    }
    return this;
  }

  catch(callback) {
    if (this.state === 'rejected') {
      callback(this.value);
    }
    return this;
  }
}

function myResolve() {
  return new Promise((resolve, reject) => {
    resolve('my resolve');
  });
}

function myReject() {
  return new Promise((resolve, reject) => {
    reject('my reject');
  });
}

myResolve() //
    .then((result) => console.log(result)) // my resolve
    .catch((result) => console.log(result)) //

myReject() //
    .then((result) => console.log(result)) //
    .catch((result) => console.log(result)); // my reject
