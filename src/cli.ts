/*
 * Copyright 2019 Thoughtworks Inc. All rights reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import chalk from 'chalk';
import commander from 'commander';
import fs from 'fs';
import Logger, {createLogger} from './logger';

import JsonProcessor from './jsonProcessor';
import TopoConnector from './topoConnector';

const logger = createLogger('cli');
logger.setLevel(Logger.INFO);

const cli = (args: any = process.argv) => {
  logger.info(chalk.yellow('TOPO File Collector'));
  commander
    .description('Please select one of the following actions: ')
    .option('-f, --file <file>', 'Parse JSON file')
    .option('--host <host>', 'Set host')
    .parse(process.argv);

  let jsonObject;

  try {
    if (!commander.file) {
      logger.error('Please provide a file with -f <path/to/file.json>');
      logger.error('Check help for other options with --help');
      throw new Error('Please provide a file');
    }

    fs.readFile(commander.file, 'utf8', async (err: any, data: any) => {
      try {
        if (err) {
          logger.error('File not found:', commander.file);
          throw new Error('File not found: ' + commander.file);
        }
        jsonObject = parseJsonFileContent(data);
        await proccessFile(commander.host, jsonObject);
      } catch (error) {
        errorMessage(error);
      }
    });
  } catch (error) {
    errorMessage(error);
  }
};

const proccessFile = (host: string, json: any) => {
  const topoConnector = new TopoConnector(host);
  const jsonProcessor = new JsonProcessor(topoConnector);
  return jsonProcessor.process(json);
};

const errorMessage = (message: string) => {
  logger.error(
    chalk.red('Something went wrong... please see above logs for details'),
  );
  logger.debug(message);
};

const parseJsonFileContent = (fileContent: string) => {
  try {
    return JSON.parse(fileContent);
  } catch (error) {
    logger.error('JSON is not valid for file:', commander.file);
    throw new Error('JSON is not valid for file: ' + commander.file);
  }
};
export default cli;
export {parseJsonFileContent};
