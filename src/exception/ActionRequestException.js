import SdkException from './SdkException.js';

/**
 * Failure during the main (the action) call.
 *
 * @author kit
 */
export default class ActionRequestException extends SdkException {
  constructor(errors = [], message = 'Action request exception') {
    super(errors, message);
  }
}
