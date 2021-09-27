import Promise from './promise.js';

function myFunc() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('first');
    }, 1000);
  });
}

myFunc()//
    .then((result) => {
      console.log('1', result);
      return new Promise((resolve) => resolve('hyunmin'));
    }) //
    .then((result) => {
      console.log('2', result);
    }) //
    .catch((error) => {
      console.log(error);
    })
