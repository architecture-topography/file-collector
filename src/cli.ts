import chalk from 'chalk'
import figlet from 'figlet';

const cli = () => {
  console.log(
    chalk.yellow(
      figlet.textSync('TOPO JSON Collector', {horizontalLayout: 'full'}),
    )
  );
}

export default cli;
