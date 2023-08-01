export const GO = (serviceName: string) => {
  return `
    module esper.io/cloud/${serviceName}
    go 1.19
`;
};
