import {TokenizeCall} from "../src";
import RequiredParamException from "../src/exception/RequiredParamException";
import ServerSideException from "../src/exception/ServerSideException";

export const tokenizeRequestParams = {
  merchantId: 168678,
  password: '12345',
  allowOriginUrl: 'http://localhost',
  merchantNotificationUrl: 'http://localhost/notify',
  number: '4111111111111111',
  nameOnCard: 'John Murphy',
  expiryMonth: '12',
  expiryYear: '2025'
}

export const veryBasicRequestParams = {
  merchantId: 168678,
  password: '12345',
  allowOriginUrl: 'http://localhost',
  merchantNotificationUrl: 'http://localhost/notify'
}

export const basicMerchantRequestParams = {
  ...veryBasicRequestParams,
  country: 'GB',
  currency: 'GBP',
  channel: 'ECOM'
}

export const tokenizeCard = async () => {
    const response = await new TokenizeCall(tokenizeRequestParams).execute();
    return response;
}

export const verifyPaymentRequestRequiredParams = (response) => {
  expect(response.message).toEqual('Missing parameters');
  expect(response).toBeInstanceOf(RequiredParamException);
  expect(response.errors[0].fieldName).toEqual('amount');
  expect(response.errors[1].fieldName).toEqual('channel');
  expect(response.errors[2].fieldName).toEqual('currency');
  expect(response.errors[3].fieldName).toEqual('country');
}

export const verifyMissingCardTokenCvvCustomerId = (response) => {
  expect(response.message).toEqual('Server side exception');
  expect(response).toBeInstanceOf(ServerSideException);
  expect(response.errors[0].fieldName).toEqual('specinCreditCardToken');
  expect(response.errors[0].messageCode).toEqual('This field is required in [TOKEN, REQUEST]');
  expect(response.errors[1].fieldName).toEqual('customerId');
  expect(response.errors[1].messageCode).toEqual('This field is required in [TOKEN, REQUEST]');
  expect(response.errors[2].fieldName).toEqual('specinCreditCardCVV');
  expect(response.errors[2].messageCode).toEqual('This field is required in [REQUEST]');
}

export const missingPaymentSolutionId = (response) => {
  expect(response.message).toEqual('Server side exception');
  expect(response).toBeInstanceOf(ServerSideException);
  expect(response.errors[0].fieldName).toEqual('paymentSolutionId');
  expect(response.errors[0].messageCode).toEqual('This field is required in [TOKEN, REQUEST]');
  expect(response.errors[1].fieldName).toEqual('paymentSolutionId');
  expect(response.errors[1].messageCode).toEqual('This field is required in [TOKEN, REQUEST]');
}

export const setBasicPaymentParams = (requestParams, cardToken, customerId) => {
  requestParams.amount = 10;
  requestParams.country = 'GB';
  requestParams.currency = 'GBP';
  requestParams.channel = 'ECOM';
  requestParams.customerId = customerId;
  requestParams.specinCreditCardToken = cardToken;
  requestParams.specinCreditCardCVV = '123';
  requestParams.paymentSolutionId = 500;
  return requestParams;
}

export const verifyMissingVoidRefundCaptureParams = (response, voidOperation = false) => {
  expect(response.message).toEqual('Missing parameters');
  expect(response).toBeInstanceOf(RequiredParamException);
  expect(response.errors[0].fieldName).toEqual('originalMerchantTxId');
  if (!voidOperation) {
    expect(response.errors[1].fieldName).toEqual('amount');
  }
}

export const testSuccessVerification = (response) => {
  expect(response.result).toEqual('success');
  expect(response.status).toEqual('VERIFIED');
  expect(response.paymentSolutionId).toEqual('500');
  expect(response.brandId).toEqual('1686780000');
  expect(response.currency).toEqual('GBP');
  expect(response.amount).toEqual('0');
  expect(response.merchantId).toEqual('168678');
}