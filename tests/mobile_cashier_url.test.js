import MobileCashierURLCall from "../src/MobileCashierURLCall";
import RequiredParamException from "../src/exception/RequiredParamException";
import IllegalActionTypeException from "../src/exception/IllegalActionTypeException";
import ActionType from "../src/define/ActionType";
import {tokenizeRequestParams} from "./test_utils";

describe('testing getting mobile sdk url request', () => {

  it('missing action parameter', async () => {
    try {
      await new MobileCashierURLCall({}).execute();
    } catch(response) {
      expect(response.message).toEqual('Missing parameters');
      expect(response).toBeInstanceOf(RequiredParamException);
      expect(response.errors[0].fieldName).toEqual('action');
      expect(response.errors[0].description).toEqual('action parameter is required in' +
        ' MobileCashierURLCall');
    }
  });

  it('not supported action', async () => {
    try {
      await new MobileCashierURLCall({action:'NOT_SUPPORTED_ACTION'}).execute();
    } catch(response) {
      expect(response.message).toEqual('Illegal action type');
      expect(response).toBeInstanceOf(IllegalActionTypeException);
      expect(response.errors[0].actionType).toEqual('NOT_SUPPORTED_ACTION');
    }
  });

  it('success', async () => {
    const requestParams = tokenizeRequestParams;
    requestParams.action = ActionType.TOKENIZE;
    const response = await new MobileCashierURLCall(requestParams).execute();
    expect(response.result).toEqual('success');
    expect(response.country).toEqual('GB');
    expect(response.merchantId).toEqual('167862');
    expect(response.cardToken).not.toEqual(null);
    expect(response.mobileCashierUrl).toEqual('https://cashierui-apiqa.test.myriadpayments.com/react-frontend/index.html');
  });

});