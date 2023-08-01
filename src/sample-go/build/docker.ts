export const BUILD_DOCKERFILE = (serviceName: string) => {
  return `
  ############################
  # STEP 1 build executable binary
  ############################
  FROM --platform=\${BUILDPLATFORM} golang:1.19-buster as builder

  ARG TARGETPLATFORM
  ARG BUILDPLATFORM
  ARG TARGETOS
  ARG TARGETARCH
  ARG BUILDARCH

  ENV ROOT_DIR /opt/esper/${serviceName}-api
  ENV BIN_DIR /opt/esper/${serviceName}-api/bin

  RUN mkdir -p $ROOT_DIR
  RUN mkdir -p $BIN_DIR

  WORKDIR $ROOT_DIR

  ADD . .

  # install cross compiler for cross platform builds
  RUN apt-get update \
      && apt-get install -y \
      gcc-aarch64-linux-gnu

  # Build the binary.
  # CGO needs to be enabled for kafka library
  # build flags:
  # -linkmode external instructs Go to always use the external linker, which is musl-gcc for Alpine
  # -extldflags '-static' instructs Go to pass the -static flag to the external linker, which in turn let musl-gcc build a static binary that also includes the three artifacts
  # -s strips the binary by omitting the symbol table and debug information
  # -w further strips the binary by also omitting the DWARF symbol table
  RUN if [ "\${TARGETARCH}" = "arm64" ] ; \
    then \
    export CC=aarch64-linux-gnu-gcc ; \
    fi \
    && \
    CGO_ENABLED=1 \
    GOOS=\${TARGETOS} \
    GOARCH=\${TARGETARCH} \
    go build -a \
    -ldflags "-linkmode external -extldflags '-static' -s -w" \
    -installsuffix \
    cgo \
    -o $BIN_DIR/${serviceName}-api .

  ############################
  # STEP 2 build a small image from scratch
  ############################
  FROM --platform=\${TARGETPLATFORM} scratch

  ENV ROOT_DIR /opt/esper/${serviceName}-api
  ENV BIN_DIR /opt/esper/${serviceName}-api/bin
  ENV RUNTIME_DIR /opt/esper/run/${serviceName}-api
  ENV LOGS_DIR /opt/esper/run/${serviceName}-api/logs

  # using WORKDIR command to create the directories because mkdir command is not available
  WORKDIR /etc/ssl/certs/
  WORKDIR $ROOT_DIR
  WORKDIR $RUNTIME_DIR
  WORKDIR $LOGS_DIR
  WORKDIR $BIN_DIR

  COPY --from=builder /opt/esper/${serviceName}-api/bin/ /opt/esper/${serviceName}-api/bin/
  COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

  ENV LISTEN_PORT 8000
  ENV RUN_MODE production
  ENV LOG_LEVEL ERROR
  ENV COMPONENT ${serviceName}-api

  EXPOSE 8000/tcp

  ENTRYPOINT [ "/opt/esper/${serviceName}-api/bin/${serviceName}-api" ]
`;
};
