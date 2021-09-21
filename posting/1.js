class Promise {
  constructor(callback) {
    callback((value) => {
      this.value = value;
    });
  }

  then(callback) {
    callback(this.value);
  }
}

function myFunc() {
  return new Promise((resolve) => {
    resolve('my resolve');
  });
}

myFunc().then((result) => console.log(result));
