import winston, { Logger } from 'winston';
import { ElasticsearchTransport, LogData } from 'winston-elasticsearch';

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
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false,
      },
      apm: {},  // Add this empty object or configure it as needed
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
