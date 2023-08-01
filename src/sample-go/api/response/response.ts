export const API_RESPONSE = () => {
  return `
    package response

    import (
        "errors"
        "fmt"

        "github.com/gofiber/fiber/v2"
    )

    type HTTPResponse struct {
        Code    int         \`json:"code"\`
        Message string      \`json:"message"\`
        Content interface{} \`json:"content"\`
    }

    type HTTPResponseContent struct {
        Count    int         \`json:"count"\`
        Previous *string     \`json:"prev"\`
        Next     *string     \`json:"next"\`
        Results  interface{} \`json:"results"\`
    }

    // Error details will be returned by a service function to the handler
    type ErrorDetails struct {
        Code    int
        Message string
        Error   error
    }

    // StatusCode refer to Http Code
    func WriteHTTPResponse(c *fiber.Ctx, statusCode int, responseBody *HTTPResponse) error {
        if statusCode < 100 || statusCode > 600 {
            return errors.New(fmt.Sprintf("Invalid status code for HTTP response: %v", statusCode))
        }
        c.Status(statusCode)
        err := c.JSON(responseBody)
        return err
    }

    // Code refer to Application Code
    func GetErrorHTTPResponseBody(code int, message string) *HTTPResponse {
        return &HTTPResponse{
            Code:    code,
            Message: message,
            Content: map[string]interface{}{},
        }
    }

    func DefaultErrorHandler(c *fiber.Ctx, err error) error {
        errorBody := GetErrorHTTPResponseBody(500, "Internal Server Error")
        return WriteHTTPResponse(c, 500, errorBody)
    }
`;
};
