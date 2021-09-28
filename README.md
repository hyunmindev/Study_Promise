# Custom Promise

## Install

```shell
npm install hyunmindev-promise 
```

## Usage

### ES6
```javascript
import Promise from 'hyunmindev-promise';

const promise = new Promise((resolve) => resolve('resolve'));
promise.then((result) => console.log(result));
```

### CommonJS
```javascript
const Promise = require('hyunmindev-promise');

const promise = new Promise((resolve) => resolve('resolve'));
promise.then((result) => console.log(result));
```
