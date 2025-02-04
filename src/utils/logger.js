const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = process.env.LOG_LEVEL || 'INFO';

export const logger = {
  error: (...args) => {
    if (logLevels[currentLogLevel] >= logLevels.ERROR) {
      console.error(new Date().toISOString(), '[ERROR]', ...args);
    }
  },
  
  warn: (...args) => {
    if (logLevels[currentLogLevel] >= logLevels.WARN) {
      console.warn(new Date().toISOString(), '[WARN]', ...args);
    }
  },
  
  info: (...args) => {
    if (logLevels[currentLogLevel] >= logLevels.INFO) {
      console.info(new Date().toISOString(), '[INFO]', ...args);
    }
  },
  
  debug: (...args) => {
    if (logLevels[currentLogLevel] >= logLevels.DEBUG) {
      console.debug(new Date().toISOString(), '[DEBUG]', ...args);
    }
  }
};