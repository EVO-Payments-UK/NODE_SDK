/**
 * Base class for the SDK exceptions.
 *
 * @author kit
 */
export default class SdkException extends Error {
  constructor(errors = [], message = 'Turnkey SDK General Exception') {
    super(message);
    this.name = 'Error';
    this.errors = errors;
  }

  /**
   * set errors detail
   * @param {Array}params
   */
  set errors(params) {
    this._errors = params;
  }

  /**
   * retrieve errors detail
   * @returns {Array}
   */
  get errors() {
    return this._errors;
  }

}