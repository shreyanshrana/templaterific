export const VALIDATOR = (apiName: string) => {
  const apiNameCapitalized = apiName.charAt(0).toUpperCase() + apiName.slice(1);
  return `
    package validator

    type ${apiNameCapitalized}Validator interface {
    }

    type ${apiNameCapitalized}ValidatorImpl struct {
        logger *logger.AppLogger
    }

    func New${apiNameCapitalized}Validator(logger *logger.AppLogger) ${apiNameCapitalized}Validator {
        return &${apiNameCapitalized}ValidatorImpl{
            logger: logger,
        }
    }
    `;
};
