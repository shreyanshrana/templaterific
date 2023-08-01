import fs from "fs";
import { DTO } from "./sample-hsr-go-api/dto/dto";
import { HANDLER } from "./sample-hsr-go-api/handler/handler";
import { REPOSITORY } from "./sample-hsr-go-api/repository/repository";
import { SERVICE } from "./sample-hsr-go-api/service/service";
import { VALIDATOR } from "./sample-hsr-go-api/validator/validator";

export const createSampleGoAPIDirs = (
  apiName: string,
  serviceName?: string
) => {
  const serviceFolder = serviceName ? `${serviceName}/` : ``;

  console.log(serviceFolder);
  const dirs = [
    `${serviceFolder}api/${apiName}`,
    `${serviceFolder}api/${apiName}/dto`,
    `${serviceFolder}api/${apiName}/handler`,
    `${serviceFolder}api/${apiName}/repository`,
    `${serviceFolder}api/${apiName}/service`,
    `${serviceFolder}api/${apiName}/validator`,
  ];

  dirs.forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
  });
};

export const createSampleGoAPIFiles = (
  apiName: string,
  serviceName?: string
) => {
  const serviceFolder = serviceName ? `${serviceName}/` : ``;

  // dto.go
  fs.writeFileSync(`${serviceFolder}api/${apiName}/dto/dto.go`, DTO());

  // handler.go
  fs.writeFileSync(
    `${serviceFolder}api/${apiName}/handler/handler.go`,
    HANDLER(apiName)
  );

  // repository.go
  fs.writeFileSync(
    `${serviceFolder}api/${apiName}/repository/repository.go`,
    REPOSITORY(apiName)
  );

  // service.go
  fs.writeFileSync(
    `${serviceFolder}api/${apiName}/service/service.go`,
    SERVICE(apiName)
  );

  // validator.go
  fs.writeFileSync(
    `${serviceFolder}api/${apiName}/validator/validator.go`,
    VALIDATOR(apiName)
  );
};
