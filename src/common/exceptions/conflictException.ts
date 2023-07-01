import { RESPONSE_MESSAGES } from "../../constants/message-types.enum";
import { CustomException } from "./customException";

export class ConflictException extends CustomException {
    constructor(message = 'Conflict') {
      super(message, 409, RESPONSE_MESSAGES.CONFLICT);
    }
}