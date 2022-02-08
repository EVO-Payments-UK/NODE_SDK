import ActionType from './define/ActionType.js';
import GetStatusCall from './GetStatusCall';
import RefundCall from './RefundCall';
import VoidCall from './VoidCall';
import CaptureCall from './CaptureCall';
import AuthCall from './AuthCall';
import PurchaseCall from './PurchaseCall';
import TokenizeCall from './TokenizeCall';
import VerifyCall from './VerifyCall';
import RequiredParamException from './exception/RequiredParamException';
import IllegalActionTypeException from './exception/IllegalActionTypeException';

/**
 * make call and retrieve mobile cashier url
 * @author kit
 */
export default class MobileCashierURLCall {
  constructor(inputParams, extraConfig = null) {
    if (!inputParams.hasOwnProperty('action')) {
      throw new RequiredParamException([{
        'fieldName': 'action',
        'description': 'action parameter is required in MobileCashierURLCall',
      }]);
    }
    if (inputParams)
      switch (inputParams['action']) {
        case ActionType.GET_STATUS:
          this.callObject = new GetStatusCall(inputParams, extraConfig);
          break;
        case ActionType.REFUND:
          this.callObject = new RefundCall(inputParams, extraConfig);
          break;
        case ActionType.VOID:
          this.callObject = new VoidCall(inputParams, extraConfig);
          break;
        case ActionType.CAPTURE:
          this.callObject = new CaptureCall(inputParams, extraConfig);
          break;
        case ActionType.AUTH:
          this.callObject = new AuthCall(inputParams, extraConfig);
          break;
        case ActionType.PURCHASE:
          this.callObject = new PurchaseCall(inputParams, extraConfig);
          break;
        case ActionType.TOKENIZE:
          this.callObject = new TokenizeCall(inputParams, extraConfig);
          break;
        case ActionType.VERIFY:
          this.callObject = new VerifyCall(inputParams, extraConfig);
          break;
        default:
          throw new IllegalActionTypeException([{
            'actionType':inputParams['action']
          }]);
      }
  }

  /**
   * retrieve token by the call action
   * @returns {Promise<*>}
   */
  token = async () => {
    const token = await this.callObject.token();
    token['mobileCashierUrl'] = this.callObject.mobileCashierUrl;
    return token;
  };

  /**
   * execute call
   * @returns {Promise<*>}
   */
  execute = async () => {
    const response = await this.callObject.execute();
    response['mobileCashierUrl'] = this.callObject.mobileCashierUrl;
    return response;
  };
}
