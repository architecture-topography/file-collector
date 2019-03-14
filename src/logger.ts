import Logger from 'js-logger';

Logger.useDefaults();

export const createLogger = (name: string) => {
  return Logger.get(name);
};

export default Logger;
