import {AuthCall, VoidCall} from "../src";

import {
    setBasicPaymentParams,
    tokenizeCard,
    verifyMissingVoidRefundCaptureParams, veryBasicRequestParams
} from "./test_utils";

describe('testing auth request', () => {

    it('missing required parameters', async () => {
        try {
            await new VoidCall(veryBasicRequestParams).execute();
        } catch (response) {
            verifyMissingVoidRefundCaptureParams(response, true);
        }
    });

    it('success void', async () => {
        const {cardToken, customerId} = await tokenizeCard();
        const authRequestParams = setBasicPaymentParams({...veryBasicRequestParams}, cardToken, customerId);
        const authResponse = await new AuthCall(authRequestParams).execute();
        veryBasicRequestParams.originalMerchantTxId = authResponse.merchantTxId;
        const response = await new VoidCall(veryBasicRequestParams).execute();
        expect(response.result).toEqual('success');
        expect(response.status).toEqual('VOID');
        expect(response.originalMerchantTxId).toEqual(authResponse.merchantTxId);
    });

});