const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const env = require('dotenv');
env.config();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors('http://localhost:4200/','https://cqube.tibilprojects.com/'));
const router = require('./api/router');
app.use('/api', router);

app.listen(port, '0.0.0.0', () => {
    console.log("Server started at port: ", port);
});