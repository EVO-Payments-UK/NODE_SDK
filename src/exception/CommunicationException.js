import SdkException from './SdkException';

/**
 * Communication Exception.
 *
 * @author kit
 */
export default class CommunicationException extends SdkException {
  constructor(errors = [], message = 'Communication exception') {
    super(errors, message);
  }
}