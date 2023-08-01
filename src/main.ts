#!/usr/bin/env node

import figlet from "figlet";
import { Command } from "commander";
import {
  createSampleGoServiceDirs,
  createSampleGoServiceFiles,
} from "./sample-go";
import { Spinner } from "cli-spinner";
import {
  createSampleGoAPIDirs,
  createSampleGoAPIFiles,
} from "./sample-hsr-gp-api";

const program = new Command();

console.log(figlet.textSync("Templaterific (for GO)"));

program
  .name("templaterific")
  .version("0.0.2")
  .description(
    "A CLI tool to generate templates for services and APIs. At this point (v0.0.2) we only support go-lang services and handler-service-repo API structure."
  )
  .option("-s, --service-name <service-name>", "Service Name")
  .option("-p, --service-port <port>", "Service Port")
  .option("-a, --api-name <api-name>", "API Name")
  .parse(process.argv);

const options = program.opts();

const serviceName = options.serviceName;
const servicePort = options.servicePort;
const apiName = options.apiName;

if (serviceName && !servicePort) {
  console.log(
    "Service port not provided. Please provide a service port with the -p or --service-port flag"
  );
  process.exit(1);
}

if (servicePort && !serviceName) {
  console.log(
    "Service name not provided. Please provide a service name with the -s or --service-name flag"
  );
  process.exit(1);
}

if (serviceName && servicePort) {
  console.log(
    `Creating service with name ${serviceName} on port ${servicePort}`
  );

  const spinner = new Spinner("Generating service... %s");
  spinner.setSpinnerString("|/-\\");
  spinner.start();

  try {
    createSampleGoServiceDirs(serviceName);
    createSampleGoServiceFiles(serviceName, servicePort);
    spinner.stop(true);
    console.log(
      `Service created with name ${serviceName} on port ${servicePort}. Please run 'go mod tidy' to install all dependencies.`
    );
  } catch (error) {
    spinner.stop(true);
    console.log("Failed to generate service. See error message below:");
    console.error(error);
  }
}

if (apiName) {
  console.log(`Creating API with name ${apiName}`);

  const spinner = new Spinner("Generating API... %s");
  spinner.setSpinnerString("|/-\\");
  spinner.start();

  try {
    createSampleGoAPIDirs(apiName, serviceName);
    createSampleGoAPIFiles(apiName, serviceName);
    spinner.stop(true);
    console.log(`API created with name ${apiName}`);
  } catch (error) {
    spinner.stop(true);
    console.log("Failed to generate API. See error message below:");
    console.error(error);
  }
}
