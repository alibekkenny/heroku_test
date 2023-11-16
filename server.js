const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');

const client = require('prom-client')
const register = new client.Registry()

app.set("view engine", "ejs");
app.set("views", "client");

app.use(express.static("client"));
app.use(bodyParser.json());

// app.use("/metrics", require(path.join(__dirname, "routes", "prometheus")));


client.collectDefaultMetrics({ register })


// Customized Http Metrics (Optional)
const httpMetricsLabelNames = ['method', 'path'];

const totalHttpRequestCount = new client.Counter({
    name: 'nodejs_http_total_count',
    help: 'Total count of HTTP requests in the Node.js app',
    labelNames: ['method', 'status'],
});

const totalHttpRequestDuration = new client.Gauge({
    name: 'nodejs_http_total_duration',
    help: 'the last duration or response time of last request',
    labelNames: httpMetricsLabelNames
});

register.registerMetric(totalHttpRequestCount);

app.get('/metrics', async (req, res) => {
    metrics = await register.metrics()
    res.set('Content-Type', register.contentType);
    res.send(metrics);
});


app.use((req, res, next) => {
    console.log('Middleware executed ', res.statusCode);
    totalHttpRequestCount.inc({
        method: req.method,
        status: res.statusCode,
    });
    next();
    // res.status(404).send('Not Found');
});


// app.get('/error', (req, res) => {
//     res.status(404).send('Not Found');
// });

app.use("/", require(path.join(__dirname, "routes", "home")));
app.use("/about", require(path.join(__dirname, "routes", "about")));
app.use("/features", require(path.join(__dirname, "routes", "features")));
app.use("/quotes", require(path.join(__dirname, "routes", "quotes")));
app.use("/facts", require(path.join(__dirname, "routes", "facts")));
app.use("/login", require(path.join(__dirname, "routes", "login")));
app.use("/sign_up", require(path.join(__dirname, "routes", "sign_up")));
app.use(
    "/verification",
    require(path.join(__dirname, "routes", "verification"))
);
app.use(
    "/subscription",
    require(path.join(__dirname, "routes", "subscription"))
);
app.use("/api", require(path.join(__dirname, "routes", "api")));



var port_num = process.env.PORT || 3000;

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.listen(port_num, () =>
    console.log(`App listening at http://localhost:${port_num}`)
);