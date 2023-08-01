export const DB_MIGRATE = (serviceName: string) => {
  return `
    package database

    import (
        "esper.io/cloud/${serviceName}/logger"

        "gorm.io/gorm"
    )

    // refer to migrate function, should be called from system/db.go

    func Migrate(repo *gorm.DB, log *logger.Logger) {
        //  migrate all the models
        // sampleModelMigrateErr := repo.AutoMigrate(&models.SampleModel{})

        switch {
        // case sampleModelMigrateErr != nil:
        // 	log.Error(sampleModelMigrateErr, "Failed to auto-migrate schema for type 'SampleModel'")
        }
    }
`;
};
