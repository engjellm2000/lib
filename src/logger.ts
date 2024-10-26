import winston, { Logger } from 'winston';
import { ElasticsearchTransport, LogData } from 'winston-elasticsearch';

// Custom transformer function
const esTransformer = (logData: LogData) => {
  // Customize this to match the expected structure for Elasticsearch
  return {
    message: logData.message,
    level: logData.level,
    timestamp: logData.timestamp,
    // Add any additional fields you need
    ...logData.meta,
  };
};

export const winstonLogger = (elasticsearchNode: string, name: string, level: string): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true,
    },
    elasticsearch: {
      level,
      transformer: esTransformer,  // Use the custom transformer
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false,
      },
      apm: {},  // Required, can be an empty object if not using APM
    },
  };

  const esTransport = new ElasticsearchTransport(options.elasticsearch);
  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [
      new winston.transports.Console(options.console),
      esTransport,
    ],
  });

  return logger;
}
