export const SYSTEM_DB = (serviceName: string) => {
  return `
    package system

    import (
        "fmt"
        "time"

        "esper.io/cloud/${serviceName}/database"
        "esper.io/cloud/${serviceName}/logger"
        "gorm.io/driver/postgres"
        "gorm.io/gorm"
    )

    type DbConfig struct {
        Host     string \`json:"db_host"\`
        Port     int    \`json:"db_port"\`
        Username string \`json:"db_user"\`
        Password string \`json:"db_password"\`
        Name     string \`json:"db_name"\`
    }

    type DbMigrationConfig struct {
        Dir string \`env:"DB_MIGRATION_DIR,required"\`
    }

    type DataSource struct {
        Db *gorm.DB
    }

    func NewDataSource(config *DbConfig, logEnabled bool) *DataSource {
        var err error
        log := logger.NewLogger()

        dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", config.Host, config.Port, config.Username, config.Password, config.Name)
        //Add customization to DB log level
        connection, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
        if err != nil {
            panic(fmt.Sprintf("Failed to connect to database: %s", err))
        }

        sqlDB, err := connection.DB()
        if err != nil {
            panic(fmt.Sprintf("Failed to connect to database: %s", err))
        }

        // SetMaxIdleConns sets the maximum number of connections in the idle connection pool.
        sqlDB.SetMaxIdleConns(10)

        // SetMaxOpenConns sets the maximum number of open connections to the database.
        sqlDB.SetMaxOpenConns(100)

        // SetConnMaxLifetime sets the maximum amount of time a connection may be reused.
        sqlDB.SetConnMaxLifetime(time.Hour)

        log.Info("Successfully connected to the Database")

        // Migrate DB
        database.Migrate(connection, log)

        return &DataSource{Db: connection}
    }

    `;
};
