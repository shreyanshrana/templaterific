export const SYSTEM_CONFIG = () => {
  return `
    package system

    import (
        "fmt"
        "os"
        "strconv"
        "strings"
    )

    type RunMode int

    const (
        DEVELOPMENT RunMode = iota
        STAGING
        PRODUCTION
    )

    func (rm RunMode) String() string {
        switch rm {
        case DEVELOPMENT:
            return "development"
        case STAGING:
            return "staging"
        default:
            return "production"
        }
    }

    type Config struct {
        ServiceToken string  \`json:"service_token"\`
        Concurrency  int     \`json:"concurrency"\`
        ListenPort   int     \`json:"listen_port"\`
        RunMode      RunMode \`json:"run_mode"\`
        LogLevel     string  \`json:"log_level"\`
        Db           DbConfig
    }

    var appConfig *Config = nil

    func NewConfig() *Config {
        //ensures that only one config object is created across the system
        if appConfig != nil {
            return appConfig
        }

        config := &Config{}
        var ok bool
        var err error

        listenPortStr, ok := os.LookupEnv("LISTEN_PORT")
        if !ok {
            panic("Missing required variable: LISTEN_PORT")
        }

        config.ListenPort, err = strconv.Atoi(listenPortStr)
        if err != nil {
            panic("Incorrect value type for LISTEN_PORT")
        }

        config.LogLevel, ok = os.LookupEnv("LOG_LEVEL")
        if !ok {
            config.LogLevel = "ERROR"
        }
        config.LogLevel = strings.ToUpper(config.LogLevel)

        runMode, _ := os.LookupEnv("RUN_MODE")
        config.RunMode = parseRunMode(runMode)

        config.Concurrency = 5
        config.Db = parseDbConfig()

        appConfig = config
        return appConfig
    }

    func (c *Config) String() string {
        s := fmt.Sprintf(
            "RUN_MODE: %d,  Concurrency: %d, LOG_LEVEL: %s, Listen Port: %d",
            c.RunMode, c.Concurrency, c.LogLevel, c.ListenPort,
        )
        return s
    }

    func parseRunMode(runMode string) RunMode {
        switch strings.ToLower(runMode) {
        case "development":
            return DEVELOPMENT
        case "staging":
            return STAGING
        default:
            return PRODUCTION
        }
    }

    func parseDbConfig() DbConfig {
        var err error
        var dbConfig DbConfig

        dbHost, ok := os.LookupEnv("DB_HOST")
        if !ok {
            panic("Missing required variable: DB_HOST")
        } else {
            dbConfig.Host = dbHost
        }

        dbPort, ok := os.LookupEnv("DB_PORT")
        if !ok {
            panic("Missing required variable: DB_PORT")
        } else {
            dbConfig.Port, err = strconv.Atoi(dbPort)
            if err != nil {
                panic("Incorrect value type for DB_PORT")
            }
        }

        dbUser, ok := os.LookupEnv("DB_USER")
        if !ok {
            panic("Missing required variable: DB_USER")
        } else {
            dbConfig.Username = dbUser
        }

        dbPassword, ok := os.LookupEnv("DB_PASSWORD")
        if !ok {
            panic("Missing required variable: DB_PASSWORD")
        } else {
            dbConfig.Password = dbPassword
        }

        dbName, ok := os.LookupEnv("DB_NAME")
        if !ok {
            panic("Missing required variable: DB_NAME")
        } else {
            dbConfig.Name = dbName
        }

        return dbConfig

    }

    `;
};
