export const BUILD_DOCKER_COMPOSE = (
  serviceName: string,
  servicePort: string
) => {
  return `
version: '3'
services:
    postgres:
      image: postgres:13
      restart: always
      container_name: ${serviceName}-db
      ports:
        - "5460:5432"
      environment:
        POSTGRES_DB: ${serviceName}db
        POSTGRES_USER: ${serviceName}admin
        POSTGRES_PASSWORD: testing1234
    api:
      build:
        context: ..
        dockerfile: ./build/Dockerfile.${serviceName}
      restart: always
      container_name: ${serviceName}-api
      ports:
        - "${servicePort}:8000"
      environment:
        - RUN_MODE=development
        - LOG_LEVEL=DEBUG
        - LISTEN_PORT=${servicePort}
        - LOGS_DIR=./logs/
        - DB_HOST=postgres
        - DB_PORT=5432
        - DB_USER=${serviceName}admin
        - DB_PASSWORD=testing1234
        - DB_NAME=${serviceName}db
      volumes:
          - ./static:/opt/esper/${serviceName}/static
          - ./logs/api:/opt/esper/run/${serviceName}/logs
      depends_on:
        - "postgres"
    nginx:
      build:
        context: ..
        dockerfile: ./build/nginx/Dockerfile.nginx
      restart: always
      container_name: ${serviceName}-nginx
      ports:
        - "27006:80"
      volumes:
        - ./static:/opt/esper/${serviceName}/static
        - ./logs/nginx:/opt/esper/run/${serviceName}/logs
      healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost:27006/health/"]
        timeout: 5s
        retries: 3
      depends_on:
        - "postgres"
        - "api"
`;
};
