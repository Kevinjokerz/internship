class HTTPError extends Error {
    protected statusCode: number;
    constructor(statusCode : number, message?: string) {
        super(message);
        this.statusCode = statusCode;
    }

    public getStatusCode() {
        return this.statusCode;
    }
}

class BadRequestError extends HTTPError {
    constructor(message?: string) {
        super(400, message || "Bad Request Error");
    }
}

class NotFoundError extends HTTPError {
    constructor(message?: string) {
        super(404, message || "Not Found Error");
    }
}

class ConflictError extends HTTPError {
    constructor(message?: string) {
        super(409, message || "Conflict Error");
    }
}

class InternalServerError extends HTTPError {
    constructor(message?: string) {
        super(500, message || "Internal Server Error");
    }
}

class UnAuthorizedError extends HTTPError {
    constructor(message?: string){
        super(401, message || "Unauthorized Error")
    }
}

class ForbiddenError extends HTTPError {
    constructor(message?: string){
        super(403, message || "Forbidden Error")
    }
}


export { HTTPError, BadRequestError, NotFoundError, ConflictError, InternalServerError, UnAuthorizedError, ForbiddenError }