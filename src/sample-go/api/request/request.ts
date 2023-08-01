export const API_REQUEST = (serviceName: string) => {
  return `
	package request

	import (
		"reflect"

		"esper.io/cloud/${serviceName}/api/response"
		"github.com/gofiber/fiber/v2"
		"github.com/google/uuid"
	)

	type RequestHeader struct {
		TenantId string
		CallerId string
	}

	func ParseRequestHeader(c *fiber.Ctx) (*RequestHeader, error) {
		headerMap := c.GetReqHeaders()
		tenantId := parseTenantId(headerMap)
		if tenantId == nil {
			body := response.GetErrorHTTPResponseBody(400, "Missing or invalid header X-Tenant-Id")

			err := response.WriteHTTPResponse(c, 400, body)
			if err != nil {
				return nil, err
			}

			return nil, nil
		}

		callerId := parseCallerId(headerMap)
		if callerId == nil {
			body := response.GetErrorHTTPResponseBody(400, "Missing or invalid header X-Caller-Id")

			err := response.WriteHTTPResponse(c, 400, body)
			if err != nil {
				return nil, err
			}

			return nil, nil
		}

		reqHeader := &RequestHeader{
			TenantId: *tenantId,
			CallerId: *callerId,
		}

		return reqHeader, nil
	}

	func parseTenantId(headerMap map[string]string) *string {
		tenantId := headerMap["X-Tenant-Id"]

		if tenantId == "" {
			return nil
		}

		_, parseErr := uuid.Parse(tenantId)
		if parseErr != nil {
			return nil
		}
		return &tenantId

	}

	func parseCallerId(headerMap map[string]string) *string {
		callerId := headerMap["X-Caller-Id"]

		if callerId == "" {
			return nil
		}

		if reflect.TypeOf(callerId) != reflect.TypeOf("") {
			return nil
		}
		return &callerId

	}
`;
};
