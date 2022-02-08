import SdkException from './SdkException.js';

/**
 * illegal action type for request.
 *
 * @author kit
 */
export default class  IllegalActionTypeException extends SdkException {
  constructor(errors = [], message = 'Illegal action type') {
    super(errors, message);
  }
}
