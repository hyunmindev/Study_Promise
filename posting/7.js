class Promise {
  constructor(callback) {
    this.state = 'pending';
    this.onFulfilledCallback = null;
    this.onRejectedCallback = null;
    callback(this.resolve, this.reject);
  }

  resolve = (value) => {
    if (this.state === 'pending') {
      this.state = 'fulfilled';
      this.value = value;
      if (this.onFulfilledCallback !== null) {
        this.onFulfilledCallback(value);
      } else {
        this.child?.resolve(value);
      }
    }
  };

  reject = (value) => {
    if (this.state === 'pending') {
      this.state = 'rejected';
      this.value = value;
      if (this.onRejectedCallback !== null) {
        this.onRejectedCallback();
      } else {
        this.child?.reject(value);
      }
    }
  };

  then(callback) {
    this.child = new Promise((resolve, reject) => {
      if (this.state === 'pending') {
        this.onFulfilledCallback = () => {
          this.handleCallback(callback, resolve, reject);
        };
      }
      if (this.state === 'fulfilled') {
        this.handleCallback(callback, resolve, reject);
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
        this.onRejectedCallback = () => {
          this.handleCallback(callback, resolve, reject);
        };
      }
      if (this.state === 'rejected') {
        this.handleCallback(callback, resolve, reject);
      }
      if (this.state === 'fulfilled') {
        resolve(this.value);
      }
    });
    return this.child;
  }

  handleCallback(callback, resolve, reject) {
    try {
      const result = callback(this.value);
      if (result instanceof Promise) {
        if (result.state === 'rejected') {
          result.catch(reject);
        } else {
          result.then(resolve);
        }
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
    setTimeout(() => reject('my reject'), 1000);
  });
}

myResolve() //
    .then((result) => {
      console.log(result);
      return 'next ' + result;
    }) //
    .then((result) => {
      console.log(result);
    }) //
    .catch((error) => {
      console.error(error);
    }); //
