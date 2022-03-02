import {TokenizeCall} from "../src";
import RequiredParamException from "../src/exception/RequiredParamException";
import ServerSideException from "../src/exception/ServerSideException";
import {veryBasicRequestParams} from "./test_utils";

describe('testing verify request:', () => {

    it('missing card details', async () => {
        try {
            await new TokenizeCall(veryBasicRequestParams).execute();
        } catch (response) {
            expect(response.message).toEqual('Missing parameters');
            expect(response).toBeInstanceOf(RequiredParamException);
            expect(response.errors[0].fieldName).toEqual('number');
            expect(response.errors[0].description).toEqual('The payment card number');
            expect(response.errors[1].fieldName).toEqual('nameOnCard');
            expect(response.errors[2].fieldName).toEqual('expiryMonth');
            expect(response.errors[3].fieldName).toEqual('expiryYear');
        }
    });

    it('use invalid card number', async () => {
        veryBasicRequestParams.number = 'aa';
        veryBasicRequestParams.nameOnCard = 'John Murphy';
        veryBasicRequestParams.expiryMonth = '12';
        veryBasicRequestParams.expiryYear = 2025;
        try {
            await new TokenizeCall(veryBasicRequestParams).execute();
        } catch (response) {
            expect(response.message).toEqual('Server side exception');
            expect(response).toBeInstanceOf(ServerSideException);
            expect(response.errors[0].fieldName).toEqual('number');
            expect(response.errors[0].messageCode).toEqual('field.too.short:2, min:10');
            expect(response.errors[1].fieldName).toEqual('number');
            expect(response.errors[1].messageCode).toEqual('field.invalid.numeric aa');
        }
    });

    it('success card tokenization', async () => {
        veryBasicRequestParams.number = '4111111111111111';
        const response = await new TokenizeCall(veryBasicRequestParams).execute();
        expect(response.cardToken).not.toEqual(null);
        expect(response.merchantId).toEqual('168678');
        expect(response.result).toEqual('success');
    });

});