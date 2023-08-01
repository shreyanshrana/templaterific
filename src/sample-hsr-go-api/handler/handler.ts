export const HANDLER = (apiName: string) => {
  const apiNameCapitalized = apiName.charAt(0).toUpperCase() + apiName.slice(1);
  return `
    package handler

    type ${apiNameCapitalized}Handler struct {
        service   service.${apiNameCapitalized}Service
        validator validator.${apiNameCapitalized}Validator
    }

    func New${apiNameCapitalized}Handler(service service.${apiNameCapitalized}Service, validator validator.${apiNameCapitalized}Validator) *${apiNameCapitalized}Handler {
        return &${apiNameCapitalized}Handler{
            validator: validator,
            service:   service,
        }
    }
`;
};
