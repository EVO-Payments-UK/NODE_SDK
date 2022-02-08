import SdkException from './SdkException';

/**
 * Exceptions returned by API server Exception.
 *
 * @author kit
 */
export default class ServerSideException extends SdkException {
  constructor(errors = [], message = 'Server side exception') {
    super(errors, message);
  }
}