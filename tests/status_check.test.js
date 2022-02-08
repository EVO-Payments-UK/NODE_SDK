import {GetStatusCall} from "../src";
import ServerSideException from "../src/exception/ServerSideException";
import {veryBasicRequestParams} from "./test_utils";

describe('testing status check endpoint', () => {

  it('missing merchantTxId and txId', async () => {
    try {
      await new GetStatusCall(veryBasicRequestParams).execute();
    } catch(response) {
      expect(response.message).toEqual('Server side exception');
      expect(response).toBeInstanceOf(ServerSideException);
      expect(response.errors[0].fieldName).toEqual('[txId, merchantTxId]');
      expect(response.errors[0].messageCode).toEqual('This field is required in [REQUEST]');
    }
  });

  it('testing success status check', async () => {
    veryBasicRequestParams.merchantTxId = 'yAzXebHM5ksJfZQQ3l8G';
    const response = await new GetStatusCall(veryBasicRequestParams).execute();
    expect(response.result).toEqual('success');
    expect(response.merchantId).toEqual(167862);
  });

});