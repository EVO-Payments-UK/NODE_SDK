import TokenRequest from './TokenRequest.js';
import ActionType from '../define/ActionType.js';

/**
 * Only token acquiration for Tokenize
 *
 * @author Kit
 */
export default class TokenizeTokenRequest extends TokenRequest {
  constructor(inputParams, extraConfig = null) {
    super(inputParams, ActionType.TOKENIZE, extraConfig);
    this.initMandatoryParams([
      'number',
      'nameOnCard',
      'expiryMonth',
      'expiryYear',
    ]);
  }
}
