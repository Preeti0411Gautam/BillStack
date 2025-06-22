import responseTime from 'response-time';
import { createLogger } from 'winston';
import { reqResTime, totalReqCounter } from "../utils/metrics.js";
import LokiTransport from 'winston-loki';

export const logger = createLogger({
  transports: [
    new LokiTransport({
      host: 'http://127.0.0.1:3100', // change if Loki is remote
    }),
  ],
});



export const metricsLogger = responseTime((req, res, time) => {
  const route = req.route?.path || req.path;
  const method = req.method;
  const status = res.statusCode.toString();

  totalReqCounter.inc();
  reqResTime.labels(method, route, status).observe(time / 1000); // convert ms to sec

  logger.info(`${method} ${req.originalUrl} - ${status} - ${time.toFixed(2)}ms`);
});
