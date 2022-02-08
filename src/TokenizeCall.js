import ActionType from './define/ActionType.js';
import BaseApiCall from './BaseApiCall.js';

/**
 * card tokenize for future use
 *
 * @author Kit
 */
export default class TokenizeCall extends BaseApiCall {
  constructor(inputParams, extraConfig = null) {
    super(inputParams, ActionType.TOKENIZE, extraConfig);
    //initialize the token request
    this.paramsConfig();
  }

  /**
   * init params for token request and action request
   */
  paramsConfig = () => {
    const {merchantId, password, allowOriginUrl, number, nameOnCard, expiryMonth, expiryYear} = this.inputParams;
    this.initTokenParams({
      'merchantId': merchantId,
      'password': password,
      'allowOriginUrl': allowOriginUrl,
      'action': this.actionType,
      'timestamp': Date.now(),
    }, false);
    this.initActionParams({
      'number': number,
      'nameOnCard': nameOnCard,
      'expiryMonth': expiryMonth,
      'expiryYear': expiryYear,
    });
    this.initMandatory([
      'number',
      'nameOnCard',
      'expiryMonth',
      'expiryYear',
    ]);
  };
}
