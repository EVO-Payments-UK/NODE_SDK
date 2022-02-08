import ActionType from './define/ActionType.js';
import BaseApiCall from './BaseApiCall.js';

/**
 * Requests authorisation for a payment
 *
 * @author Kit Han
 */
export default class AuthCall extends BaseApiCall {
  constructor(inputParams, extraConfig = null) {
    super(inputParams, ActionType.AUTH, extraConfig);
    this.paramsConfig();
  }

  /**
   * specify class params
   */
  paramsConfig = () => {
    const {customerId, specinCreditCardToken, specinCreditCardCVV} = this.inputParams;
    this.initActionParams({
      'customerId': customerId,
      'specinCreditCardToken': specinCreditCardToken,
      'specinCreditCardCVV': specinCreditCardCVV,
    });
    this.initMandatory([
      'amount',
      'channel',
      'currency',
      'country',
    ]);
  };

}
