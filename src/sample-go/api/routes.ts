export const API_ROUTES = (serviceName: string) => {
  return `
package api

import (
	"esper.io/cloud/${serviceName}/api/health"
	"esper.io/cloud/${serviceName}/api/response"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(server *APIServer) {
	app := server.app

	/*------------------------------------Health-----------------------------------------*/
	app.Get("/health", health.Health)

	app.All("/*", func(c *fiber.Ctx) error {
		body := response.GetErrorHTTPResponseBody(405, "Method Not Found")
		err := response.WriteHTTPResponse(c, 405, body)
		if err != nil {
			return err
		}
		return nil
	})

}`;
};
