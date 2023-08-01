export const REPOSITORY = (apiName: string) => {
  const apiNameCapitalized = apiName.charAt(0).toUpperCase() + apiName.slice(1);
  return `
    package repository

    type ${apiNameCapitalized}Repository interface {
    }

    func New${apiNameCapitalized}Repository(dataSource *system.DataSource) ${apiNameCapitalized}Repository {
        return &${apiNameCapitalized}RepositoryImpl{
            db: dataSource.Db,
        }
    }

    type ${apiNameCapitalized}RepositoryImpl struct {
        db *gorm.DB
    }
    `;
};
