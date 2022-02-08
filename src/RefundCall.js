import ActionType from './define/ActionType.js';
import BaseApiCall from './BaseApiCall.js';

/**
 * Performs a capture operation on an authorized payment
 *
 * @author Kit Han
 */
export default class RefundCall extends BaseApiCall {
  constructor(inputParams, extraConfig = null) {
    super(inputParams, ActionType.REFUND, extraConfig);
    this.initMandatory([
      'originalMerchantTxId',
      'amount',
    ]);
  }

}