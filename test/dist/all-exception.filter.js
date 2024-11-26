"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const my_logger_service_1 = require("./my-logger/my-logger.service");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter extends core_1.BaseExceptionFilter {
    constructor() {
        super(...arguments);
        this.logger = new my_logger_service_1.MyLoggerService(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const myResponseObj = {
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            timeStamp: new Date().toISOString(),
            path: request.url,
            response: 'Internal Server Error',
        };
        if (exception instanceof common_1.HttpException) {
            const exceptionResponse = exception.getResponse();
            const exceptionMessage = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : exceptionResponse.message || JSON.stringify(exceptionResponse);
            myResponseObj.statusCode = exception.getStatus();
            myResponseObj.response = exceptionMessage;
        }
        else {
            console.error('Unexpected exception:', exception);
        }
        response.status(myResponseObj.statusCode).json(myResponseObj);
        this.logger.error(`Error occurred: ${JSON.stringify({
            statusCode: myResponseObj.statusCode,
            response: myResponseObj.response,
            method: request.method,
            url: request.url,
        })}`, exception instanceof Error ? exception.stack : null);
        super.catch(exception, host);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exception.filter.js.map