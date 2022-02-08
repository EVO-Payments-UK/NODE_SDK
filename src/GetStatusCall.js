import ActionType from './define/ActionType.js';
import BaseApiCall from './BaseApiCall.js';

/**
 * Performs a capture operation on an authorized payment
 *
 * @author Kit Han
 */
export default class GetStatusCall extends BaseApiCall {
  constructor(inputParams, extraConfig = null) {
    super(inputParams, ActionType.GET_STATUS, extraConfig);
    this.initParams();
  }

  initParams = () => {
    this.initTokenParams(this.inputParams);
    this.initActionParams({
      'action':this.actionType,
      'txId':this.inputParams['txId'],
      'merchantTxId':this.inputParams['merchantTxId'],
    });
  };

}