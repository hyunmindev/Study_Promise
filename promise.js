export default class Promise {
  #hasError;
  #rejectPayLoad;
  #resolvePayLoad;

  constructor(callBack) {
    this.callBack = callBack;
    this.callBack(this.#resolve, this.#reject);
  }

  then(callBack) {
    if (!this.#hasError) {
      callBack(this.#resolvePayLoad);
    }
    return this;
  }

  catch(callBack) {
    if (this.#hasError) {
      callBack(this.#rejectPayLoad);
    }
    return this;
  }

  finally(callBack) {
    callBack();
  }

  #resolve = (payLoad) => {
    this.#resolvePayLoad = payLoad;
    this.#hasError = false;
  }

  #reject = (payLoad) => {
    this.#rejectPayLoad = payLoad;
    this.#hasError = true;
  }
}
