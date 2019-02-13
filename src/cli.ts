import chalk from 'chalk'
import figlet from 'figlet';

const cli = (output: {log: Function} = console) => {
  output.log(
    chalk.yellow(
      figlet.textSync('TOPO JSON Collector', {horizontalLayout: 'full'}),
    )
  );
}

export default cli;
