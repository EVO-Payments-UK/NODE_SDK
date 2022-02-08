import ActionType from './define/ActionType.js';
import BaseApiCall from './BaseApiCall.js';

/**
 * Does an authorize and capture operations at once (and cannot be voided)
 */
export default class PurchaseCall extends BaseApiCall {
  constructor(inputParams, extraConfig = null) {
    super(inputParams, ActionType.PURCHASE, extraConfig);
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
