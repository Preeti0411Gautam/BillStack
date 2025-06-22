import client from "prom-client";

// Collect default system metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

export const totalReqCounter = new client.Counter({
  name: 'total_req',
  help: 'Total number of requests',
});

export const reqResTime = new client.Histogram({
  name: 'http_express_req_res_time',
  help: 'Request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

export default client;
