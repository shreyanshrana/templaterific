export const API_REQUEST_TEST = (serviceName: string) => {
  return `
	package request

	import (
		"encoding/json"
		"testing"

		"esper.io/cloud/${serviceName}/api/response"
		"github.com/gofiber/fiber/v2"
		"github.com/gofiber/fiber/v2/utils"
		"github.com/valyala/fasthttp"
	)

	const (
		VALID_TENANT_ID = "460a4c27-b974-4c20-99b5-29aa6f10054e"
		VALID_SCAPI_URL = "https://localhost:8000"
		AUTH_TOKEN      = "someauthtoken"
	)

	func setupApp() *fiber.App {
		app := fiber.New()

		return app
	}

	func TestParseRequestHeaderForValidHeaders(t *testing.T) {
		app := setupApp()

		reqHeader := fasthttp.RequestHeader{}
		tenantId := VALID_TENANT_ID

		reqHeader.Add("X-Tenant-Id", tenantId)
		reqHeader.Add("X-Caller-Id", "1")

		ctx := app.AcquireCtx(&fasthttp.RequestCtx{
			Request: fasthttp.Request{
				Header: reqHeader,
			},
		})
		defer app.ReleaseCtx(ctx)

		header, err := ParseRequestHeader(ctx)
		utils.AssertEqual(t, nil, err)
		utils.AssertEqual(t, header.TenantId, tenantId)
	}

	func TestParseRequestHeaderForMissingTenantId(t *testing.T) {
		app := setupApp()

		reqHeader := fasthttp.RequestHeader{}
		reqHeader.Add("X-Caller-Id", "1")

		ctx := app.AcquireCtx(&fasthttp.RequestCtx{
			Request: fasthttp.Request{
				Header: reqHeader,
			},
		})
		defer app.ReleaseCtx(ctx)

		header, err := ParseRequestHeader(ctx)

		var apiResponse response.HTTPResponse
		_ = json.Unmarshal(ctx.Response().Body(), &apiResponse)

		var expectedHeaderValue *RequestHeader = nil
		utils.AssertEqual(t, expectedHeaderValue, header)
		utils.AssertEqual(t, nil, err)
		utils.AssertEqual(t, 400, apiResponse.Code)
		utils.AssertEqual(t, "Missing or invalid header X-Tenant-Id", apiResponse.Message)
	}

	func TestParseRequestHeaderForInvalidTenantId(t *testing.T) {
		app := setupApp()

		tenantId := "1234"
		reqHeader := fasthttp.RequestHeader{}
		reqHeader.Add("X-Tenant-Id", tenantId)
		reqHeader.Add("X-Caller-Id", "1")

		ctx := app.AcquireCtx(&fasthttp.RequestCtx{
			Request: fasthttp.Request{
				Header: reqHeader,
			},
		})
		defer app.ReleaseCtx(ctx)

		header, err := ParseRequestHeader(ctx)

		var apiResponse response.HTTPResponse
		_ = json.Unmarshal(ctx.Response().Body(), &apiResponse)

		var expectedHeaderValue *RequestHeader = nil
		utils.AssertEqual(t, expectedHeaderValue, header)
		utils.AssertEqual(t, nil, err)
		utils.AssertEqual(t, 400, apiResponse.Code)
		utils.AssertEqual(t, "Missing or invalid header X-Tenant-Id", apiResponse.Message)
	}

	func TestParseRequestHeaderForMissingCallerId(t *testing.T) {
		app := setupApp()

		tenantId := "460a4c27-b974-4c20-99b5-29aa6f10054e"
		reqHeader := fasthttp.RequestHeader{}
		reqHeader.Add("X-Tenant-Id", tenantId)

		ctx := app.AcquireCtx(&fasthttp.RequestCtx{
			Request: fasthttp.Request{
				Header: reqHeader,
			},
		})
		defer app.ReleaseCtx(ctx)

		header, err := ParseRequestHeader(ctx)

		var apiResponse response.HTTPResponse
		_ = json.Unmarshal(ctx.Response().Body(), &apiResponse)

		var expectedHeaderValue *RequestHeader = nil
		utils.AssertEqual(t, expectedHeaderValue, header)
		utils.AssertEqual(t, nil, err)
		utils.AssertEqual(t, 400, apiResponse.Code)
		utils.AssertEqual(t, "Missing or invalid header X-Caller-Id", apiResponse.Message)
	}
`;
};
