import Promise from './promise.js';

function myFunc() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('first'), 1000);
  });
}

myFunc() //
    .then((result) => {
      console.log(1, result);
      return new Promise((resolve) => {
        setTimeout(() => resolve('hyunmin'), 1000);
      });
    }) //
    .then((result) => {
      console.log(2, result);
      throw 'error';
    }) //
    .catch((error) => {
      console.log(3, error);
    });
