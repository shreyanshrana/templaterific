export const API_HEALTH_HANDLER = (serviceName: string) => {
  return `
    package health

    import (
        "os"

        "esper.io/cloud/${serviceName}/logger"
        "github.com/gofiber/fiber/v2"
    )

    func Health(c *fiber.Ctx) error {
        log := logger.NewLogger()

        log.Info("Starting route processing for health")
        hostname, err := os.Hostname()
        if err != nil {
            panic(err)
        }
        services := map[string]interface{}{}
        response := map[string]interface{}{
            "service":   "${serviceName}",
            "component": "api",
            "hostname":  hostname,
            "services":  services,
        }

        log.Debug("Completed processing route")

        return c.JSON(response)
    }
`;
};
