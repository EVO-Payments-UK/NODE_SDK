import SdkException from './SdkException.js';

/**
 * One or more required parameter were left out.
 *
 * @author kit
 */
export default class RequiredParamException extends SdkException {
  constructor(errors = [], message = 'Missing parameters') {
    super(errors, message);
  }
}
