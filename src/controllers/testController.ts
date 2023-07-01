import middy from "@middy/core";
import * as testService from "../services/testService"
import { APIGatewayProxyResult } from "aws-lambda";
import { errorHandlerResponse, responseBody } from "../common/utils";
import { RESPONSE_MESSAGES } from "../common/constants/message-types.enum";

export const testLambda = middy(async (): Promise<APIGatewayProxyResult> => {
    const result = await testService.testGet();

    return responseBody(200, RESPONSE_MESSAGES.SUCCESS, result, true)
})
.onError(errorHandlerResponse)