import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Message } from "../constants/message.enum";
import { StatusCode } from "../constants/status-code.enum";
import { ErrorDto } from "../dto";
import { FieldValidationsException } from "./field-validations.exception";

@Catch()
export class AppExceptionFilter implements ExceptionFilter {

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: Error, host: ArgumentsHost): void {

        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let responseBody: ErrorDto | ErrorDto[] = {
            code: `50001`,
            message: exception.message,
            timestamp: new Date().toISOString()
        }


        if (exception instanceof HttpException) {
            const messageKey = exception.getResponse()['message'];
            httpStatus = exception.getStatus();

            if (exception instanceof FieldValidationsException) {
                responseBody = messageKey;
            } else {
                const resolvedMessage = Message[Object.keys(Message)[Object.values(StatusCode).indexOf(messageKey)]];
                responseBody.code = messageKey;
                responseBody.message = resolvedMessage || messageKey;
            }
        }

        console.log(exception); // TODO: to add proper logging...
        httpAdapter.reply(ctx.getResponse(), { errors: responseBody }, httpStatus);
    }
}