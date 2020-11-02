const express = require('express');
const compression = require('compression')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const axios = require('axios');
const env = require('dotenv');
env.config();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());

const router = require('./api/router');
app.use('/api', router);

const restartSchedular = require('./api/controller/niFiScheduler/restartSchedular');

app.listen(port, '0.0.0.0', () => {
    console.log("Server started at port: ", port);
    restartSchedular.restartNifiProcess();
});