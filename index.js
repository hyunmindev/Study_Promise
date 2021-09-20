import Promise from './promise.js';

function myFunc(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value) {
        resolve('resolve');
      } else {
        reject('reject');
      }
    }, 1000);
  });
}

myFunc(true).then((result) => console.log(result));
