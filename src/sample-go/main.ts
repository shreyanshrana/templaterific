export const MAIN = (serviceName: string) => {
  return `
    package main

    import (
        "context"
        "sync"

        gologger "log"

        "esper.io/cloud/${serviceName}/api"
        "esper.io/cloud/${serviceName}/system"
    )

    var (
        config *system.Config
    )

    func init() {
        config = system.NewConfig()
    }

    func main() {

        //app.Use(middleware.Cors)
        // app.Use(middleware.KeyAuth) todo: enable when needed | solve liveleness probe with auth

        gologger.Printf("Starting application with config: %s", config)

        // todo refactor this properly: without nested go routines
        _, cancel := context.WithCancel(context.Background())

        wg := &sync.WaitGroup{}
        wg.Add(1)
        gologger.Print("Starting the server with DEFAULT configuration.")

        // start API server
        go func() {
            defer wg.Done()

            apiServer := api.NewServer(config)
            apiServer.StartServer()
        }()
        cancel()
        wg.Wait()

    }
    `;
};
