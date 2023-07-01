import { RESPONSE_MESSAGES } from "../constants/message-types.enum";
import { CustomException } from "./customException";

export class BadRequestException extends CustomException {
    constructor(message = 'Bad request') {
      super(message, 400, RESPONSE_MESSAGES.BAD_REQUEST);
    }
}