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
    return new Promise((resolve, reject) => {
      if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
            const result = callback(this.value);
            if (result instanceof Promise) {
              result.then(resolve);
            } else {
              resolve(result);
            }
        });
      }
      if (this.state === 'fulfilled') {
        const result = callback(this.value);
        if (result instanceof Promise) {
          result.then(resolve);
        } else {
          resolve(result);
        }
      }
    });
  }

  catch(callback) {
    return new Promise((resolve, reject) => {
      if (this.state === 'pending') {
        this.onRejectedCallbacks.push(() => {
          const result = callback(this.value);
          if (result instanceof Promise) {
            result.then(resolve);
          } else {
            resolve(result);
          }
        });
      }
      if (this.state === 'rejected') {
        const result = callback(this.value);
        if (result instanceof Promise) {
          result.then(resolve);
        } else {
          resolve(result);
        }
      }
    });
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
    }); //



