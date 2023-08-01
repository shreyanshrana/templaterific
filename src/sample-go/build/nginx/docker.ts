export const BUILD_NGINX_DOCKERFILE = (serviceName: string) => {
  return `
    FROM nginx:1.19-alpine
    ENV RUNTIME_DIR /opt/esper/run/${serviceName}/nginx
    ENV LOGS_DIR /opt/esper/run/${serviceName}/logs
    RUN mkdir -p $RUNTIME_DIR
    RUN mkdir -p $LOGS_DIR
    EXPOSE 27000
    COPY ./build/nginx/default.conf /etc/nginx/conf.d/default.conf
`;
};
