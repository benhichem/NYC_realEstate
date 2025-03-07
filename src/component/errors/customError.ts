class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational: boolean = true,
        public details?: any
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class PageBlocked extends AppError {
    constructor(message: string = "Unauthorized access Status Code 401") {
        super(401, message)
    }
}

