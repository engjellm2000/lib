"use strict";

exports.__esModule = true;
exports.winstonLogger = void 0;
var _winston = _interopRequireDefault(require("winston"));
var _winstonElasticsearch = require("winston-elasticsearch");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Custom transformer function
const esTransformer = logData => {
  // Customize this to match the expected structure for Elasticsearch
  return {
    message: logData.message,
    level: logData.level,
    timestamp: logData.timestamp,
    // Add any additional fields you need
    ...logData.meta
  };
};
const winstonLogger = (elasticsearchNode, name, level) => {
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
  const esTransport = new _winstonElasticsearch.ElasticsearchTransport(options.elasticsearch);
  const logger = _winston.default.createLogger({
    exitOnError: false,
    defaultMeta: {
      service: name
    },
    transports: [new _winston.default.transports.Console(options.console), esTransport]
  });
  return logger;
};
exports.winstonLogger = winstonLogger;
//# sourceMappingURL=logger.js.map