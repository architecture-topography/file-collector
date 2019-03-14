import Logger from 'js-logger';

Logger.useDefaults();

const loglevel = process.env.LOGLEVEL;
if (loglevel) {
  switch(loglevel) {
    case 'DEBUG':
      Logger.setLevel(Logger.DEBUG);
      break;
    case 'ERROR':
      Logger.setLevel(Logger.ERROR);
      break;
    case 'INFO':
      Logger.setLevel(Logger.INFO);
      break;
    case 'WARN':
      Logger.setLevel(Logger.WARN);
      break;
    case 'TRACE':
      Logger.setLevel(Logger.TRACE);
      break;
  }
}

export const createLogger = (name: string) => {
  return Logger.get(name);
};

export default Logger;
