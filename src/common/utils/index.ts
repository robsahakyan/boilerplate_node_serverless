import { RESPONSE_MESSAGES } from "../constants/message-types.enum";
import { ErrorWithMessage } from "../constants/types";
import { CustomException } from "../exceptions/customException";

export const errorHandler = (error: any): ErrorWithMessage => {
    let message: string = "";
    if (error instanceof Error) {
        message = error.message;
    }

    return { message };
}

export const errorHandlerResponse = async (event: any) => {
    console.log("-- inside errorHandler middleware --", event?.error);
    if (event?.error instanceof CustomException) {
        return responseBody(event?.error?.statusCode, event?.error?.responseMessageType, event?.error?.message, false);
    }
    let { statusCode = 400, data } = event?.error;
    if (!data && event?.error?.length) {
        data = event.error;
    }
    return responseBody(statusCode, RESPONSE_MESSAGES.FAILURE, data, false);
};

export const responseBody = (statusCode = 400, message: string | null = "", data: Object | null = {}, success: boolean, error_code?: number) => {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            success,
            error_code,
            message,
            data
        })
    }
}
