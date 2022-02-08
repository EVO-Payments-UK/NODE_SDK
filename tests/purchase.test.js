import {PurchaseCall} from "../src";
import {
    basicMerchantRequestParams,
    missingPaymentSolutionId,
    tokenizeCard,
    verifyMissingCardTokenCvvCustomerId,
    verifyPaymentRequestRequiredParams, veryBasicRequestParams
} from "./test_utils";

describe('testing purchase request', () => {

    it('missing required parameters', async () => {
        try {
            await new PurchaseCall(veryBasicRequestParams).execute();
        } catch (response) {
            verifyPaymentRequestRequiredParams(response);
        }
    });

    it('missing paymentSolutionId', async () => {
        try {
            basicMerchantRequestParams.amount = 1;
            await new PurchaseCall(basicMerchantRequestParams).execute();
        } catch (response) {
            missingPaymentSolutionId(response);
        }
    });

    it('missing card token, cvv and customerId', async () => {
        try {
            basicMerchantRequestParams.paymentSolutionId = 500;
            await new PurchaseCall(basicMerchantRequestParams).execute();
        } catch (response) {
            verifyMissingCardTokenCvvCustomerId(response);
        }
    });

    it('success purchase', async () => {
        const {cardToken, customerId} = await tokenizeCard();
        basicMerchantRequestParams.customerId = customerId;
        basicMerchantRequestParams.specinCreditCardToken = cardToken;
        basicMerchantRequestParams.specinCreditCardCVV = '123';
        const response = await new PurchaseCall(basicMerchantRequestParams).execute();
        expect(response.result).toEqual('success');
        expect(response.status).toEqual('CAPTURED');
        expect(response.txId).not.toEqual(null);
    });

});