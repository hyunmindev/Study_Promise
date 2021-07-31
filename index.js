import Promise from './promise.js';

function testPromise(isSuccess) {
  return new Promise((resolve, reject) => {
    if (isSuccess) {
      resolve('then');
    } else {
      reject('catch');
    }
  });
}

testPromise(false) //
    .then((value) => {
      console.log(value);
    }) //
    .catch((error) => {
      console.error(error);
    }) //
    .finally(() => {
      console.log('finally');
    });
