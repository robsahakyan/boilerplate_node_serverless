import { RESPONSE_MESSAGES } from "../../constants/message-types.enum";
import { CustomException } from "./customException";

export class NotFoundException extends CustomException {
    constructor(message = 'Not found') {
      super(message, 404, RESPONSE_MESSAGES.NOT_FOUND);
    }
}