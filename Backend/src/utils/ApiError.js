class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        stack,
        errors = []
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack;
    }
}

export default ApiError;