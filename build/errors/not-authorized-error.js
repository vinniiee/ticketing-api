"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedError = void 0;
const custom_error_1 = require("./custom-error");
class NotAuthorizedError extends custom_error_1.CustomError {
    serializeErrors() { return [{ message: "Not Authorized" }]; }
    // throw new Error("Method not implemented.");
    constructor() {
        super("Not Authorized");
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
