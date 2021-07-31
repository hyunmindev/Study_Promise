export default class Promise {
  #status;
  #value;

  constructor(handler) {
    const resolve = (value) => {
      this.#value = value;
      this.#status = 'resolved';
    };
    const reject = (value) => {
      this.#value = value;
      this.#status = 'rejected';
    };

    this.callBack = handler;
    this.callBack(resolve, reject);
  }

  then(callBack) {
    if (this.#status === 'resolved') {
      callBack(this.#value);
    }
    return this;
  }

  catch(callBack) {
    if (this.#status === 'rejected') {
      callBack(this.#value);
    }
    return this;
  }

  finally(callBack) {
    callBack();
  }
}
