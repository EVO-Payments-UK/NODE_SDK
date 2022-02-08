import SdkException from './SdkException.js';

/**
 * Failed to request the token for the action call.
 *
 * @author kit
 */
export default class TokenRequestException extends SdkException {
  constructor(errors = [], message = 'Could not acquire token') {
    super(errors, message);
  }
}
