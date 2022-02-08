const ParameterDefinition = {
  'merchantId': 'The identifier for the merchant in the IPG Gateway provided at on-boarding',
  'allowOriginUrl': 'The merchant\'s URL that will make the Tokenize Request',
  'number': 'The payment card number',
};

export const getParameterDescription = (param) => {
  return (param in ParameterDefinition) ?
      ParameterDefinition[param] : '';
};