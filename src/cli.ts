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
import figlet from 'figlet';
import fs from 'fs';

import JsonProcessor from './jsonProcessor';
import TopoInterface from './topoInterface';

const cli = (args: any = process.argv) => {
  console.log(
    chalk.yellow(
      'TOPO JSON Collector'
    )
  );
  commander
    .description('Please select one of the following actions: ')
    .option('-f, --file <file>', 'Parse JSON file')
    .option('--host <host>', 'Set host')
    .parse(process.argv);

  let jsonObject;

  try {
    if (!commander.file) {
      throw new Error('Please provide a file');
    }

    checkFile(commander.file);
    fs.readFile(commander.file, 'utf8', (err: any, data: any) => {
      try {
        if (err) {
          throw new Error('File not found: ' + commander.file);
        }
        jsonObject = parseJsonFileContent(data);
        proccessFile(commander.host, jsonObject);
      } catch (error) {
        errorMessage(error);
      }
    });
  } catch (error) {
    errorMessage(error);
  }
};

const proccessFile = (host: string, json: any) => {
  const topoInterface = new TopoInterface(host);
  const jsonProcessor = new JsonProcessor(topoInterface);
  jsonProcessor.process(json);
};

const errorMessage = (message: string) => {
  console.log(chalk.red(message));
  commander.outputHelp();
};

const checkFile = (file: string) => {
  const fileExtension = file.substring(file.lastIndexOf('.'), file.length);
  if (fileExtension !== '.json') {
    throw new Error('Please provide a valid .json file.');
  }
};

const parseJsonFileContent = (fileContent: string) => {
  try {
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error('JSON is not valid for file: ' + commander.file);
  }
};
export default cli;
export { checkFile, parseJsonFileContent };
