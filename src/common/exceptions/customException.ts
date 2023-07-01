import { RESPONSE_MESSAGES } from "../../constants/message-types.enum";

export class CustomException extends Error {
    statusCode: number
    responseMessageType: RESPONSE_MESSAGES
    constructor(message: string, statusCode: number, responseMessageType: RESPONSE_MESSAGES) {
      super(message);
      this.statusCode = statusCode;
      this.responseMessageType = responseMessageType
    }
  }
