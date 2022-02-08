import ApiCall from '../ApiCall.js';

export default class ActionRequest extends ApiCall {

  /**
   * initialize mandatory params
   * @param {Array} params
   */
  initMandatoryParams = params => {
    this.mandatoryParams = new Set(['merchantId', 'token']);
    params.reduce((s, e) => s.add(e), this.mandatoryParams);
  };
  /**
   * execute ipg API request
   * @return {Promise}
   */
  execute = async () => {
    return this.postToApi(this.apiPathConfig[this.APIACTIONURL], this.inputParams);
  };
}
