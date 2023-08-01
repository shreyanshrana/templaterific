export const SERVICE = (apiName: string) => {
  const apiNameCapitalized = apiName.charAt(0).toUpperCase() + apiName.slice(1);
  return `
    package service

    type ${apiNameCapitalized}Service interface {
    }

    type ${apiNameCapitalized}ServiceImpl struct {
        logger           *logger.AppLogger
        repository       repository.${apiNameCapitalized}Repository
        externalServices ExternalServices
    }

    type ExternalServices struct {
    }

    func New${apiNameCapitalized}Service(logger *logger.AppLogger, repository repository.${apiNameCapitalized}Repository) ${apiNameCapitalized}Service {
        return &${apiNameCapitalized}ServiceImpl{
            logger:     logger,
            repository: repository,
            externalServices: ExternalServices{
            },
        }
    }
  `;
};
