/*
  ApiError is a custom error class used to handle all API errors in a clean and consistent way.
  Instead of throwing normal Error, we throw ApiError with proper HTTP status codes and messages.
  Whenever an error occurs in any controller, we throw new ApiError(...).
  This error is caught by asyncHandler and passed to the global error middleware.
  The global error middleware then sends a fixed JSON response format like:

  {
    success: false,
    data: null,
    message: "Error message here",
    errors: []
  }

  This approach helps to:
  - Avoid server crash
  - Keep all error responses in the same format
  - Send correct HTTP status codes (400, 401, 404, 500, etc.)
  - Make debugging easier using stack trace
  - Keep controllers clean and readable
*/

class ApiError extends Error {
    constructor(
        message="something went wrong",
        statusCode=500,
        errors=[],
        stack=""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data=null
        this.errors = errors;
        this.sucsses = false;
        if(stack){
            this.stack=stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }

    }
}    
export {ApiError}