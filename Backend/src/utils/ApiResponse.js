class ApiResponse {
    constructor(
        statusCode,
        success,
        message,
        data,
        errors,
    ) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;

    }

}

export default ApiResponse;