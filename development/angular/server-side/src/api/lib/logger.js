const moment = require('moment');
const winston = require('winston');
const { Config } = require('./config');

function createLogger() {
  const transports = [];
  if (!Config.Log || Config.Log.toLowerCase().includes('console')) {
    transports.push(new (winston.transports.Console)({
      // this removes the winston format and uses just this, so becomes uglier:
      // formatter(options) {
      //   return `${Config.envName} - ${options.message ? options.message : ''}`;
      // },
      json: false,
      timestamp: true,
      level: Config.consoleLogLevel ? Config.consoleLogLevel : 'info',
      prettyPrint: true,
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }));
  }

  if (!!Config.Log && Config.Log.toLowerCase().includes('file')) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss Z');
    transports.push(new winston.transports.File({
      filename: `${Config.LogDirectory}/engine${timestamp}.log`,
      json: false,
      level: `${Config.fileLogLevel}`,
      prettyPrint: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }));
  }
  const levels = {
    error: 0,
    info: 1,
    debug: 2,
  };
  const colors = {
    error: 'red',
    info: 'green',
    debug: 'gray',
  };
  const log = new (winston.Logger)({ transports, levels, exitOnError: false });
  winston.addColors(colors);
  return log;
}

const loggerWithoutEnv = createLogger();

const logger = {
  error(text) {
    loggerWithoutEnv.error(`PORT: ${Config.port}: ${text}`);
  },
  info(text) {
    loggerWithoutEnv.info(`PORT: ${Config.port}: ${text}`);
  },
};

module.exports = { logger };
