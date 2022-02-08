/**
 * Intelligent Paymanents API calls (for API version: 3.0) base class
 *
 * @author Kit
 */
import RequiredParamException from './exception/RequiredParamException.js';
import Axios from 'axios';
import querystring from 'querystring';
import fs from 'fs';
import path from 'path';
import CommunicationException from './exception/CommunicationException';
import {getParameterDescription} from './define/ParameterDefinition';

export default class ApiCall {
  constructor(inputParams, actionType = null, extraConfig = null) {
    if (extraConfig) {
      this.apiPathConfig = extraConfig;
    } else {
      const configFileName = (process.env.NODE_ENV ?
          process.env.NODE_ENV :
          'development') + '.json';
      this.apiPathConfig = JSON.parse(
          fs.readFileSync(
              path.join(__dirname, '../config', configFileName)));
    }
    this.inputParams = inputParams;
    this.inputParams['timestamp'] = Date.now();
    this.inputParams['action'] = actionType;
    this.actionType = actionType;
    this.initConfigConst();
  }

  /**
   * @param {Array} params
   */
  set mandatoryParams(params) {
    this._mandatoryParams = params;
  }

  /**
   * get mandatory params
   * @returns {Array}
   */
  get mandatoryParams() {
    return this._mandatoryParams || [];
  }

  /**
   * define config params name
   */
  initConfigConst = () => {
    this.APITOKENURL = 'sessionTokenRequestUrl';
    this.APIACTIONURL = 'paymentOperationActionUrl';
    this.APICASHIERURL = 'cashierUrl';
    this.APIJAVASCRIPTURL = 'javaScriptUrl';
    this.APIMOBILEURL = 'mobileCashierUrl';
  };

  /**
   * not everything iParameterDefinitions validated (mandatory fields checked, no complex validation, the conditionally mandatory fields not check either)
   *
   * @throws RequiredParamException
   */
  preValidateParams = () => {
    const missingItems = [];
    this.mandatoryParams.forEach(key => {
      if (!(key in this.inputParams)) {
        missingItems.push({
          'fieldName': key,
          'description': getParameterDescription(key),
        });
      }
    });
    if (missingItems.length > 0) {
      throw new RequiredParamException(missingItems);
    }
  };

  /**
   * set sub action type
   * @param type
   */
  set subActionType(type) {
    this._subActionType = type;
  }

  /**
   * get sub action value
   * @returns {*}
   */
  get subActionType() {
    return this._subActionType;
  }

  /**
   * set action type for request
   */
  set actionType(type) {
    this._actionType = type;
  }

  /**
   * return action type string
   */
  get actionType() {
    return this._actionType;
  }

  /**
   * set token request
   * @param {TokenRequest} request
   */
  set tokenRequest(request) {
    this._tokenRequest = request;
  }

  /**
   * set action request
   * @param {ActionRequest} request
   */
  set actionRequest(request) {
    this._actionRequest = request;
  }

  /**
   * get tokenRequest
   * return {TokenRequest} tokenRequest
   */
  get tokenRequest() {
    return this._tokenRequest;
  }

  /**
   * get actionRequest
   * return {ActionRequest} actionRequest
   */
  get actionRequest() {
    return this._actionRequest;
  }

  set tokenParams(params) {
    this._tokenParams = params;
  }

  get tokenParams() {
    return this._tokenParams;
  }

  set actionParams(params) {
    this._actionParams = params;
  }

  get actionParams() {
    return this._actionParams;
  }

  /**
   * cashier url for hosted payment
   * @returns {*}
   */
  get cashierUrl() {
    return this.apiPathConfig[this.APICASHIERURL];
  }

  get javaScriptUrl() {
    return this.apiPathConfig[this.APIJAVASCRIPTURL];
  }

  /**
   * mobile url
   * @returns {*}
   */C;

  get mobileCashierUrl() {
    return this.apiPathConfig[this.APIMOBILEURL];
  }

  /**
   * executes the call
   * @return {Promise} the action call
   */
  execute = async () => {
  };

  /**
   * initiates HTTP POST toward the API (via {@link Axios}) (outgoing request)
   *
   * @param url
   * @param params
   * @return Promise
   */
  postToApi = async (url, params) => {
    const response = await Axios.post(url, querystring.stringify(params)).
        catch(function(error) {
          console.log(error);
          throw new CommunicationException();
        });
    return response.data;
  };

}
