enum ErrorType {
    VALIDATION_ERROR = "Validation Error",
    DATABASE_ERROR = "Database Error",
    AUTHENTICATION_ERROR = "Authentication Error",
    NOT_FOUND = 'Not Found',
    INTERNAL_SERVER_ERROR = "something unexpected happened"
}

enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export type Status = "pending" | "in-progress" | "completed";

export {
    ErrorType,
    HttpStatusCode,
    
}