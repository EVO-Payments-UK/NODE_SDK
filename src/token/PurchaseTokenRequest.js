import TokenRequest from './TokenRequest.js';
import ActionType from '../define/ActionType.js';

/**
 * Only token acquiration for purchase
 * @author Kit
 */
export default class PurchaseTokenRequest extends TokenRequest {
  constructor(inputParams, extraConfig = null) {
    super(inputParams, ActionType.PURCHASE, extraConfig);
    this.initMandatoryParams(['channel', 'amount', 'currency', 'country']);
  }
}
