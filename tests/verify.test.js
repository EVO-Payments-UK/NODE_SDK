import {VerifyCall} from "../src";
import {testSuccessVerification, tokenizeCard, basicMerchantRequestParams} from "./test_utils";

describe('testing verify request:', () => {

    it('success verification', async () => {
        const {cardToken, customerId} = await tokenizeCard();
        basicMerchantRequestParams.amount = '0';
        basicMerchantRequestParams.customerId = customerId;
        basicMerchantRequestParams.specinCreditCardToken = cardToken;
        basicMerchantRequestParams.specinCreditCardCVV = '123';
        const verifyResponse = await new VerifyCall(basicMerchantRequestParams).execute();
        testSuccessVerification(verifyResponse);
    });

    it('due to removing amount from verify request sending request with amount > 0 is not causing' +
        ' a verify failure', async () => {
        basicMerchantRequestParams.amount = '11';
        const response = await new VerifyCall(basicMerchantRequestParams).execute();
        testSuccessVerification(response);
    });

});