import { RESPONSE_MESSAGES } from "../../constants/message-types.enum";
import { CustomException } from "./customException";

export class ForbiddenException extends CustomException {
    constructor(message = 'Forbidden request') {
      super(message, 403, RESPONSE_MESSAGES.FORBIDDEN);
    }
}