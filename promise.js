export default class Promise {
  #status = 'pending';
  #value;
  #onResolvedCallbacks = [];
  #onRejectedCallbacks = [];

  constructor(handler) {
    console.log('constructor called');

    const resolve = (value) => {
      console.log('resolve called');
      this.#value = value;
      this.#status = 'resolved';
      this.#onResolvedCallbacks.forEach((callback) => {
        callback(value);
      });
    };

    const reject = (value) => {
      console.log('reject called');
      this.#value = value;
      this.#status = 'rejected';
      this.#onRejectedCallbacks.forEach((callback) => {
        callback(value);
      });
    };

    this.callBack = handler;
    this.callBack(resolve, reject);
  }

  then(onResolved) {
    if (this.#status === 'pending') {
      this.#onResolvedCallbacks.push(onResolved);
    } else if (this.#status === 'resolved') {
      onResolved(this.#value);
    }
    return this;
  }

  catch(onRejected) {
    if (this.#status === 'pending') {
      this.#onRejectedCallbacks.push(onRejected);
    } else if (this.#status === 'rejected') {
      onRejected(this.#value);
    }
    return this;
  }

  finally(callBack) {
    if (this.#status !== 'pending') {
      callBack();
    }
  }
}
