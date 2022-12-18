import { CustomError } from "./custom-error";


export class NotAuthorizedError extends CustomError{
    statusCode= 401;
    serializeErrors() { return [{message: "Not Authorized" }]}
        // throw new Error("Method not implemented.");

    constructor(){
        super("Not Authorized");
        Object.setPrototypeOf(this,NotAuthorizedError.prototype);
    }
    }


