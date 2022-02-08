import ApiCall from '../ApiCall.js';

/**
 * Only token acquiration
 * @author Kit
 */
export default class TokenRequest extends ApiCall {
  /**
   * initialize mandatory params
   * @param {Array} params
   */
  initMandatoryParams = params => {
    this.mandatoryParams = new Set([
      'merchantId',
      'password',
      'allowOriginUrl',
      'merchantNotificationUrl',
      'action',
      'timestamp',
    ]);
    params.reduce((s, e) => s.add(e), this.mandatoryParams);
  };

  /**
   * execute ipg API request
   * @return {Promise}
   */
  execute = async () => {
    // this.preValidateParams();
    return this.postToApi(this.apiPathConfig[this.APITOKENURL], this.inputParams);
  };
}
