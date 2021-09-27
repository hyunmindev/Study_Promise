class Promise {
  constructor(callback) {
    this.state = 'pending';
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    callback(this.resolve, this.reject);
  }

  resolve = (value) => {
    if (this.state === 'pending') {
      this.state = 'fulfilled';
      this.value = value;
      this.onFulfilledCallbacks.forEach((callback) => callback(value));
    }
  };

  reject = (value) => {
    if (this.state === 'pending') {
      this.state = 'rejected';
      this.value = value;
      this.onRejectedCallbacks.forEach((callback) => callback(value));
      if (this.onRejectedCallbacks.length === 0) {
        this.child.reject();
      }
    }
  };

  then(callback) {
    this.child = new Promise((resolve, reject) => {
      if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          try {
            const result = callback(this.value);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.state === 'fulfilled') {
        const result = callback(this.value);
        resolve(result);
      }
      if (this.state === 'rejected') {
        reject(this.value);
      }
    });
    return this.child;
  }

  catch(callback) {
    this.child = new Promise((resolve, reject) => {
      if (this.state === 'pending') {
        this.onRejectedCallbacks.push(() => {
          const result = callback(this.value);
          resolve(result);
        });
      }
      if (this.state === 'rejected') {
        const result = callback(this.value);
        resolve(result);
      }
      if (this.state === 'fulfilled') {
        resolve(this.value);
      }
    });
    return this.child;
  }
}

function myResolve() {
  return new Promise((resolve, reject) => {
    // reject('my resolve');
    setTimeout(() => reject('my resolve'), 1000);
  });
}

myResolve() //
    // .catch((result) => console.error(result)) //
    .then((result) => {
      return `next ${result}`;
    }) //
    .then((result) => {
      console.log(result);
      throw 'second';
    }) //
    .catch((result) => console.error(result)); //
