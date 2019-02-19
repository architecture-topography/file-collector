import chalk from "chalk";
import figlet from "figlet";
import commander from "commander";
const fs = require('fs');


const cli = (args: any = process.argv) => {
  console.log(
    chalk.yellow(
      figlet.textSync("TOPO JSON Collector", { horizontalLayout: "full" })
    )
  );
   commander
    .description("Please select one of the following actions: ")
    .option("-f, --file <file>", "Parse JSON file")
    .option("--host <host>", "Set host")
    .option("--port <port>", "Set port")
    .parse(process.argv);

    let jsonObject;

    try {
      if (!commander.file) throw new Error("Please provide a file");

      checkFile(commander.file);
      fs.readFile(commander.file, 'utf8', (err: any, data: any) => {
        try {
          if (err) throw new Error('File not found: ' + commander.file);
          jsonObject = parseJsonFileContent(data);
          console.log(chalk.green("SUCCESS: Your file is valid."))
          console.log(JSON.stringify(jsonObject));
        }
        catch (error) {
          errorMessage(error);
        }
      });
  } catch (error) {
    errorMessage(error);
  }
};

const errorMessage = (message: string) => {
  console.log(chalk.red(message));
  commander.outputHelp();
}

const checkFile = (file: string) => {
  const fileExtension = file.substring((file.lastIndexOf('.')), file.length);
  if (fileExtension !== '.json') throw new Error('Please provide a valid .json file.')
}

const parseJsonFileContent = (fileContent: string) => {
  try {
    return JSON.parse(fileContent);
  }
  catch (error) {
    throw new Error('JSON is not valid for file: ' + commander.file);
  }
}
export default cli;
export {checkFile, parseJsonFileContent};
