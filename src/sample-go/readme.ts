export const README = (serviceName: string, servicePort: string) => {
  const serviceNameInTitleCase =
    serviceName.charAt(0).toUpperCase() + serviceName.substr(1).toLowerCase();

  return `
    # ${serviceNameInTitleCase} Service
    The ${serviceNameInTitleCase} service contains all the code related to the ${serviceName} domain.

    ## Dependencies/Pre-requisites
    - Go
    - Postgres
    - Docker

    ## Setup Instruction for local
    To run the service locally, export the env variables first then execute following ${serviceName}.
    \`\`\`
    go run main.go
    \`\`\`
    > Ensure postgres is running and env variables are exported.

    You can access the service at http://localhost:listenport/

    **Sample export ${serviceName}**
    \`\`\`
    export LOG_LEVEL=debug \\
    RUN_MODE=development \\
    LISTEN_PORT=${servicePort} \\
    LOGS_DIR=./logs/ \\
    DB_HOST=127.0.0.1 \\
    DB_PORT=5460 \\
    DB_USER=${serviceName}admin \\
    DB_PASSWORD=testing1234 \\
    DB_NAME=${serviceName}db
    \`\`\`

    ## Docker Setup
    \`\`\`$ROOT_DIR\`\`\` is the ${serviceName} directory

    **Build**
    \`\`\`
    docker compose -f $ROOT_DIR/build/docker-compose-local.yml --project-name ${serviceName} build
    \`\`\`
    **Run the docker compose**
    \`\`\`
    docker compose -f $ROOT_DIR/build/docker-compose-local.yml --project-name ${serviceName} up
    \`\`\`
    *Note: The docker compose setup doesn't support hot reload.*

    ## Test
    To run the test locally
    \`\`\`
    go test ./...
    \`\`\`

    GoMock library is used for mocking interface (https://github.com/golang/mock) . To mock an interface
    \`\`\`
    mockgen -destination=mocks/<file_name.go> -package=<package_name_to_create_mock_file> <source_package_path> <interface name>
    \`\`\`
    For example:
    \`\`\`
    mockgen -destination=mocks/validator.go -package=mocks esper.io/cloud/${serviceName}/api/tenant/validator TenantValidator
    \`\`\`

    ## Contribution Guidelines
    1.  Every PR should have a description. PR descriptions should talk about what you are trying to achieve with the PR. And if there is complex logic involved, please make it part of the description, and add comments in the code where necessary.
    2.  If there are APIs, descriptions should have a link to the API contracts. Please also make sure the API spec in the repository is updated.
    3.  PR headings should have the ticket number, ideally every commit should have the ticket number, this helps with backtracking the origin of the code.
    4.  PR's should have test cases, if there are no test cases, specify why.
    5.  If there is additional work has to be done, and will be picked up later. A general guideline is to create a ticket, assign it to yourself and add the ticket as a comment in your code.
    6.  Try to check in smaller chunks of code.
    7. If there are a large number of commits, please squash the commit before merging
    8.  Please put PR that have to be reviewed in  [#code-reviews](https://esperio.slack.com/archives/CEZ1P27FB)  and tag the concerned folks.
`;
};
