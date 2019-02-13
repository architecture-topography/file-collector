#!/usr/bin/env node

import chalk from 'chalk'
import figlet from 'figlet';

console.log(
  chalk.yellow(
    figlet.textSync('TOPO JSON Collector', {horizontalLayout: 'full'}),
  )
);
