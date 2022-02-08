import ActionType from './define/ActionType.js';
import BaseApiCall from './BaseApiCall.js';

/**
 * Requests verify for a payment
 *
 * @author Kit Han
 */
export default class VerifyCall extends BaseApiCall {
  constructor(inputParams, extraConfig = null) {
    super(inputParams, ActionType.VERIFY, extraConfig);
    this.paramsConfig();
  }

  /**
   * specify class params
   */
  paramsConfig = () => {
    //remove amount related parameter
    const {
      amount, taxAmount, shippingAmount, chargeAmount, discountAmount,
      ...tokenParams
    } = this.inputParams;
    this.initTokenParams(tokenParams);
    const {customerId, specinCreditCardToken, specinCreditCardCVV} = this.inputParams;
    this.initActionParams({
      'customerId': customerId,
      'specinCreditCardToken': specinCreditCardToken,
      'specinCreditCardCVV': specinCreditCardCVV,
    });
    this.initMandatory([
      'channel',
      'currency',
      'country',
    ]);
  };

}
