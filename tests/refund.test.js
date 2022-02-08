import {PurchaseCall, RefundCall} from "../src";

import {
    setBasicPaymentParams,
    tokenizeCard,
    verifyMissingVoidRefundCaptureParams, veryBasicRequestParams
} from "./test_utils";
import ServerSideException from "../src/exception/ServerSideException";

describe('testing refund request', () => {

    it('missing required parameters', async () => {
        try {
            await new RefundCall(veryBasicRequestParams).execute();
        } catch (response) {
            verifyMissingVoidRefundCaptureParams(response);
        }
    });

    it('success partial refund', async () => {
        successRefund(1);
    });

    it('success complete refund', async () => {
        successRefund(10);
    });

    const makeRefund = async (amount) => {
        const {cardToken, customerId} = await tokenizeCard();
        const purchaseRequestParams = setBasicPaymentParams({...veryBasicRequestParams}, cardToken, customerId);
        const purchaseResponse = await new PurchaseCall(purchaseRequestParams).execute();
        expect(purchaseResponse.status).toEqual('CAPTURED');
        expect(purchaseResponse.result).toEqual('success');
        expect(purchaseResponse.merchantTxId).not.toEqual(null);
        veryBasicRequestParams.originalMerchantTxId = purchaseResponse.merchantTxId;
        veryBasicRequestParams.amount = amount;
        const refundResponse = await new RefundCall(veryBasicRequestParams).execute();
        return {refundResponse: refundResponse, merchantTxId: purchaseResponse.merchantTxId}
    }

    const successRefund = async (amount) => {
        const {refundResponse, merchantTxId} = await makeRefund(amount);
        expect(refundResponse.result).toEqual('success');
        expect(refundResponse.status).toEqual('SET_FOR_REFUND');
        expect(refundResponse.originalMerchantTxId).toEqual(merchantTxId);
    }

    it('refund too big amount comparing to auth', async () => {
        try {
            await makeRefund(20);
        } catch (response) {
            expect(response.message).toEqual('Server side exception');
            expect(response).toBeInstanceOf(ServerSideException);
            expect(response.name).toEqual('Error');
            expect(response._errors).toEqual('Transaction not refundable: The requested amount (20)' +
                ' exceeds the refundable amount (10.0)');
        }
    });

});