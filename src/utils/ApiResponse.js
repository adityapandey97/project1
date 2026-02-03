/*
  ApiResponse is a helper class used to send all successful API responses
  in a fixed and clean format. Instead of sending random JSON from every API,
  we return new ApiResponse(...) so that frontend always gets the same structure.

  Example success response format:

  {
    success: true,
    statusCode: 200,
    message: "Operation successful",
    data: {...}
  }

  This helps to:
  - Keep all API responses consistent
  - Make frontend handling easier
  - Avoid confusion in large projects
  - Make debugging and logging easier
  - Keep controller code clean and readable

  We use it like:
  return res.status(200).json(new ApiResponse(200, "User fetched", user));
*/

class ApiResponse {
    constructor(statusCode, message="sucsses ", data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.sucsses = statusCode < 400;
    }
}
export default ApiResponse;