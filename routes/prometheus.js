const express = require("express");
const https = require('https')
const router = express.Router();
const client = require('prom-client')
const register = new client.Registry()


client.collectDefaultMetrics({ register })

router.route("/metrics").get(async (req, res) => {
    res.set('Content-Type', register.contentType)
    metrics = await register.metrics();
    res.send(metrics)
})

// Customized Http Metrics (Optional)
const httpMetricsLabelNames = ['method', 'path'];

const totalHttpRequestCount = new client.Counter({
    name: 'nodejs_http_total_count',
    help: 'total request number',
    labelNames: httpMetricsLabelNames
});

const totalHttpRequestDuration = new client.Gauge({
    name: 'nodejs_http_total_duration',
    help: 'the last duration or response time of last request',
    labelNames: httpMetricsLabelNames
});


// call this function to intecept ALL routes with detailed HTTP metrics (Optional)
// function initRoutingMetrics() {
//     router.stack.forEach(router.all());
// }


module.exports = router, totalHttpRequestCount;