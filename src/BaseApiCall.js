import ApiCall from './ApiCall.js';
import ActionRequest from './action/ActionRequest.js';
import TokenRequest from './token/TokenRequest.js';
import TokenRequestException from './exception/TokenRequestException';
import ActionRequestException from './exception/ActionRequestException';
import ServerSideException from './exception/ServerSideException';

/**
 * Base class for Auth/Purchase/Verify
 * @author Kit Han
 */
export default class BaseApiCall extends ApiCall {

  constructor(inputParams, actionType, extraConfig = null) {
    super(inputParams, actionType, extraConfig);
    this.initParams();
  }

  initParams = (params = null) => {
    this.initTokenParams(this.inputParams);
    this.initActionParams();
    this.mandatoryParams = [
      'action',
      'timestamp',
      'merchantId',
      'password',
      'allowOriginUrl',
      'merchantNotificationUrl',
    ];
  };

  /**
   * define token request params
   * @param params
   * @param isMerge [true]merge input params with predefined params
   *               [false] replace predefined params
   * @returns {{}}
   */
  initTokenParams = (params = {}, isMerge = true) => {
    const queryParams = {};
    queryParams['action'] = this.actionType;
    queryParams['timestamp'] = Date.now();

    if (isMerge) {
      this.tokenParams = Object.assign(queryParams, params);
    } else {
      this.tokenParams = params;
    }
  };

  initActionParams = (params = {}) => {
    const queryParams = {merchantId: this.inputParams.merchantId};
    this.actionParams = Object.assign(queryParams, params);
  };

  /**
   * define mandatory except basic items
   * @param params
   * @param isMerge
   */
  initMandatory = (params = [], isMerge = true) => {
    if (isMerge) {
      this.mandatoryParams = this.mandatoryParams.concat(params);
    } else {
      this.mandatoryParams = params;
    }
  };

  /**
   * api request token response
   * @returns {Promise}
   */
  token = async () => {
    this.preValidateParams();
    const tokenRequest = new TokenRequest(this.tokenParams, this.actionType, this.apiPathConfig);
    const tokenResponse = await tokenRequest.execute().
        catch(function(response) {
          throw new TokenRequestException();
        });
    if (tokenResponse.result === 'failure') {
      throw new ServerSideException(tokenResponse.errors);
    }
    return tokenResponse;
  };

  /**
   * fetch token and pass to action request
   * @return {Promise} the action call
   */
  execute = async () => {
    const tokenResponse = await this.token();
    if (tokenResponse.result === 'success') {
      const actionRequest = new ActionRequest(Object.assign(this.actionParams, {
        'token': tokenResponse.token,
      }), this.actionType, this.apiPathConfig);
      const actionResponse = await actionRequest.execute().
          catch(function(error) {
            throw new ActionRequestException();
          });
      if (actionResponse.result === 'failure') {
        throw new ServerSideException(actionResponse.errors);
      }
      return actionResponse;
    }
    return tokenResponse;
  };
}
