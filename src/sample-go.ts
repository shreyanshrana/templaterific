import fs from "fs";
import { README } from "./sample-go/readme";
import { API_HEALTH_HANDLER } from "./sample-go/api/health/handler";
import { API_REQUEST } from "./sample-go/api/request/request";
import { API_REQUEST_TEST } from "./sample-go/api/request/request_test";
import { API_RESPONSE } from "./sample-go/api/response/response";
import { API_RESPONSE_TEST } from "./sample-go/api/response/response_test";
import { API_ROUTES } from "./sample-go/api/routes";
import { API_SERVER } from "./sample-go/api/server";
import { BUILD_DOCKERFILE } from "./sample-go/build/docker";
import { BUILD_DOCKER_COMPOSE } from "./sample-go/build/docker-compose";
import { BUILD_NGINX_DOCKERFILE } from "./sample-go/build/nginx/docker";
import { BUILD_NGINX_DEFAULT } from "./sample-go/build/nginx/default";
import { DB_MIGRATE } from "./sample-go/database/migrate";
import { GO } from "./sample-go/go";
import { LOGGER } from "./sample-go/logger/logger";
import { MAIN } from "./sample-go/main";
import { SYSTEM_CONFIG } from "./sample-go/system/config";
import { SYSTEM_DB } from "./sample-go/system/db";

export const createSampleGoServiceDirs = (serviceName: string) => {
  const dirs = [
    `${serviceName}/api/`,
    `${serviceName}/api/health`,
    `${serviceName}/api/request`,
    `${serviceName}/api/response`,
    `${serviceName}/build`,
    `${serviceName}/build/nginx`,
    `${serviceName}/database`,
    `${serviceName}/database/models`,
    `${serviceName}/logger`,
    `${serviceName}/system`,
  ];

  dirs.forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
  });
};

export const createSampleGoServiceFiles = (
  serviceName: string,
  servicePort: string
) => {
  // README file
  fs.writeFileSync(
    `${serviceName}/README.md`,
    README(serviceName, servicePort)
  );

  //Go.mod
  fs.writeFileSync(`${serviceName}/go.mod`, GO(serviceName));

  //main.go
  fs.writeFileSync(`${serviceName}/main.go`, MAIN(serviceName));

  //api/
  fs.writeFileSync(`${serviceName}/api/routes.go`, API_ROUTES(serviceName));
  fs.writeFileSync(`${serviceName}/api/server.go`, API_SERVER(serviceName));

  //api/health
  fs.writeFileSync(
    `${serviceName}/api/health/handler.go`,
    API_HEALTH_HANDLER(serviceName)
  );

  //api/request
  fs.writeFileSync(
    `${serviceName}/api/request/request.go`,
    API_REQUEST(serviceName)
  );
  fs.writeFileSync(
    `${serviceName}/api/request/request_test.go`,
    API_REQUEST_TEST(serviceName)
  );

  //api/response
  fs.writeFileSync(`${serviceName}/api/response/response.go`, API_RESPONSE());
  fs.writeFileSync(
    `${serviceName}/api/response/response_test.go`,
    API_RESPONSE_TEST()
  );

  //build/
  fs.writeFileSync(
    `${serviceName}/build/Dockerfile.${serviceName}`,
    BUILD_DOCKERFILE(serviceName)
  );
  fs.writeFileSync(`${serviceName}/build/api-spec.yaml`, "");
  fs.writeFileSync(
    `${serviceName}/build/docker-compose-local.yml`,
    BUILD_DOCKER_COMPOSE(serviceName, servicePort)
  );

  //build/nginx
  fs.writeFileSync(
    `${serviceName}/build/nginx/Dockerfile.nginx`,
    BUILD_NGINX_DOCKERFILE(serviceName)
  );
  fs.writeFileSync(
    `${serviceName}/build/nginx/default.conf`,
    BUILD_NGINX_DEFAULT(serviceName)
  );

  //database/
  fs.writeFileSync(
    `${serviceName}/database/migrate.go`,
    DB_MIGRATE(serviceName)
  );

  //logger/
  fs.writeFileSync(`${serviceName}/logger/logger.go`, LOGGER(serviceName));

  //system/
  fs.writeFileSync(`${serviceName}/system/config.go`, SYSTEM_CONFIG());
  fs.writeFileSync(`${serviceName}/system/db.go`, SYSTEM_DB(serviceName));
};
