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

app.listen(port, '0.0.0.0', () => {
    console.log("Server started at port: ", port);
});

function restartNifiProcess() {
    var schedularData = JSON.parse(fs.readFileSync('./schedulers.json'));
    schedularData.forEach(myJob => {
        if (myJob.state == "RUNNING") {
            let state = myJob.state;
            let timeToSchedule = myJob.hours + ":" + myJob.mins;
            let stopTime = myJob.timeToStop - myJob.hours;
            axios.post(`http://localhost:3001/api/nifi/scheduleProcessor/${myJob.groupId}`, { time: timeToSchedule, stopTime: stopTime, state: state });
        }
    });
}