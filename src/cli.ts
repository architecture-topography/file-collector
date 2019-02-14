import chalk from "chalk";
import figlet from "figlet";
import commander from "commander";

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

  commander.outputHelp();
};

export default cli;
