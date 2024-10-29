function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

// Custom transformer function
const esTransformer = logData => {
  // Customize this to match the expected structure for Elasticsearch
  return _extends({
    message: logData.message,
    level: logData.level,
    timestamp: logData.timestamp
  }, logData.meta);
};
export const winstonLogger = (elasticsearchNode, name, level) => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      // Use the custom transformer
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      },
      apm: {} // Required, can be an empty object if not using APM
    }
  };
  const esTransport = new ElasticsearchTransport(options.elasticsearch);
  const logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: {
      service: name
    },
    transports: [new winston.transports.Console(options.console), esTransport]
  });
  return logger;
};
//# sourceMappingURL=logger.js.map