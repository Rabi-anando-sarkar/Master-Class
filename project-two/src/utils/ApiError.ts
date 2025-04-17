import { ErrorType } from "../types/enums";
import { HttpStatusCode } from "../types/enums";

class ApiError extends Error {

    statusCode: HttpStatusCode;
    data: any;
    success: boolean;
    errors: string[];
    errorType!: ErrorType;

    constructor (
        statusCode: HttpStatusCode,
        message: string = "Something Went Wrong",
        errorType: ErrorType = ErrorType.INTERNAL_SERVER_ERROR,
        errors: string[] = [],
        stack: string = "",
    ) {
        super(message)

        Object.setPrototypeOf(this, ApiError.prototype)

        this.statusCode = statusCode;
        this.data = null;
        this.errorType = errorType
        this.success = false;
        this.errors = errors;

        if(stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { 
    ApiError,
    ErrorType,
    HttpStatusCode
}