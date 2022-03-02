import {TokenizeCall} from "../src";
import ServerSideException from "../src/exception/ServerSideException";
import RequiredParamException from "../src/exception/RequiredParamException";
import {tokenizeRequestParams} from "./test_utils";

describe('testing token request:', function () {

    it('missing all required params', async () => {
        try {
            await new TokenizeCall({}).token();
        } catch (response) {
            expect(response.message).toEqual('Missing parameters');
            expect(response).toBeInstanceOf(RequiredParamException);
            expect(response.errors[0].fieldName).toEqual('merchantId');
            expect(response.errors[0].description).toEqual('The identifier for the merchant in the IPG' +
                ' Gateway provided at on-boarding');
            expect(response.errors[1].fieldName).toEqual('password');
            expect(response.errors[2].fieldName).toEqual('allowOriginUrl');
            expect(response.errors[2].description).toEqual('The merchant\'s URL that will make the' +
                ' Tokenize Request');
            expect(response.errors[3].fieldName).toEqual('merchantNotificationUrl');
            expect(response.errors[4].fieldName).toEqual('number');
            expect(response.errors[4].description).toEqual('The payment card number');
            expect(response.errors[5].fieldName).toEqual('nameOnCard');
            expect(response.errors[6].fieldName).toEqual('expiryMonth');
            expect(response.errors[7].fieldName).toEqual('expiryYear');
        }
    });

    it('missing all params despite merchantId', async () => {
        try {
            await new TokenizeCall({merchantId: 168678}).token();
        } catch (response) {
            expect(response.message).toEqual('Missing parameters');
            expect(response).toBeInstanceOf(RequiredParamException);
            expect(response.errors[0].fieldName).toEqual('password');
            expect(response.errors[1].fieldName).toEqual('allowOriginUrl');
            expect(response.errors[1].description).toEqual('The merchant\'s URL that will make the' +
                ' Tokenize Request');
            expect(response.errors[2].fieldName).toEqual('merchantNotificationUrl');
            expect(response.errors[3].fieldName).toEqual('number');
            expect(response.errors[3].description).toEqual('The payment card number');
            expect(response.errors[4].fieldName).toEqual('nameOnCard');
            expect(response.errors[5].fieldName).toEqual('expiryMonth');
            expect(response.errors[6].fieldName).toEqual('expiryYear');
        }
    });

    it('missing all params despite merchantId and expiryYear', async () => {
        try {
            await new TokenizeCall({merchantId: 168678, expiryYear: '20'}).token();
        } catch (response) {
            expect(response.message).toEqual('Missing parameters');
            expect(response).toBeInstanceOf(RequiredParamException);
            expect(response.errors[0].fieldName).toEqual('password');
            expect(response.errors[1].fieldName).toEqual('allowOriginUrl');
            expect(response.errors[1].description).toEqual('The merchant\'s URL that will make the' +
                ' Tokenize Request');
            expect(response.errors[2].fieldName).toEqual('merchantNotificationUrl');
            expect(response.errors[3].fieldName).toEqual('number');
            expect(response.errors[3].description).toEqual('The payment card number');
            expect(response.errors[4].fieldName).toEqual('nameOnCard');
            expect(response.errors[5].fieldName).toEqual('expiryMonth');
        }
    });

    it('success token request', async () => {
        const response = await new TokenizeCall(tokenizeRequestParams).token();
        expect(response.result).toEqual('success');
        expect(response.merchantId).toEqual('168678');
        expect(response.token).not.toEqual(null);
    });

});