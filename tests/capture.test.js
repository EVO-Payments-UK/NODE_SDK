import {AuthCall, CaptureCall} from "../src";

import {
    basicMerchantRequestParams,
    setBasicPaymentParams,
    tokenizeCard,
    verifyMissingVoidRefundCaptureParams
} from "./test_utils";
import ServerSideException from "../src/exception/ServerSideException";

describe('testing capture request', () => {

    it('missing required parameters', async () => {
      try {
        await new CaptureCall(basicMerchantRequestParams).execute();
      } catch(response) {
        verifyMissingVoidRefundCaptureParams(response);
      }
    });

    it('success capture', async () => {
        const {cardToken, customerId} = await tokenizeCard();
        const authRequestParams = setBasicPaymentParams({...basicMerchantRequestParams}, cardToken, customerId);
        const authResponse = await new AuthCall(authRequestParams).execute();
        expect(authResponse.status).toEqual('NOT_SET_FOR_CAPTURE');
        expect(authResponse.result).toEqual('success');
        expect(authResponse.merchantTxId).not.toEqual(null);
        basicMerchantRequestParams.originalMerchantTxId = authResponse.merchantTxId;
        basicMerchantRequestParams.amount = 10;
        const captureResponse = await new CaptureCall(basicMerchantRequestParams).execute();
        expect(captureResponse.result).toEqual('success');
        expect(captureResponse.status).toEqual('SET_FOR_CAPTURE');
        expect(captureResponse.originalMerchantTxId).toEqual(authResponse.merchantTxId);
    });

    it('capture too big amount comparing to auth', async () => {
      const { cardToken, customerId } = await tokenizeCard();
      const authRequestParams = setBasicPaymentParams({...basicMerchantRequestParams}, cardToken, customerId);
      const authResponse = await new AuthCall(authRequestParams).execute();
      expect(authResponse.status).toEqual('NOT_SET_FOR_CAPTURE');
      expect(authResponse.result).toEqual('success');
      expect(authResponse.merchantTxId).not.toEqual(null);
      basicMerchantRequestParams.originalMerchantTxId = authResponse.merchantTxId;
      basicMerchantRequestParams.amount = 20;
      try {
        await new CaptureCall(basicMerchantRequestParams).execute();
      } catch(response) {
        expect(response.message).toEqual('Server side exception');
        expect(response).toBeInstanceOf(ServerSideException);
        expect(response.name).toEqual('Error');
        expect(response._errors).toEqual('Transaction not capturable: Transaction ' + authResponse.merchantTxId + '. Requested amount 20'+basicMerchantRequestParams.currency+' exceeds authorized amount 10'+basicMerchantRequestParams.currency+'');
      }
    });

    it('partial capture not allowed', async () => {
        const {cardToken, customerId} = await tokenizeCard();
        const authRequestParams = setBasicPaymentParams({...basicMerchantRequestParams}, cardToken, customerId);
        const authResponse = await new AuthCall(authRequestParams).execute();
        expect(authResponse.status).toEqual('NOT_SET_FOR_CAPTURE');
        expect(authResponse.result).toEqual('success');
        expect(authResponse.merchantTxId).not.toEqual(null);
        basicMerchantRequestParams.originalMerchantTxId = authResponse.merchantTxId;
        basicMerchantRequestParams.amount = 15;
        try {
            await new CaptureCall(basicMerchantRequestParams).execute();
        } catch (response) {
            expect(response.message).toEqual('Server side exception');
            expect(response).toBeInstanceOf(ServerSideException);
            expect(response.name).toEqual('Error');
            expect(response._errors).toEqual('Transaction not capturable: Transaction ' + authResponse.merchantTxId + '. Requested amount 15'+basicMerchantRequestParams.currency+' exceeds authorized amount 10'+basicMerchantRequestParams.currency);
        }
    });

});