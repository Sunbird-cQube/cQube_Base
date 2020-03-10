var express = require('express');
var app = express();
const aws = require('aws-sdk');
var cors = require('cors')
var const_data = require('./aws-config')
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
var temp_key = const_data.getParams;

app.use(cors())
app.get('/s3-month-wise', function (req, res) {    
    logger.debug("Some debug messages");
    temp_key['Key']='Output/month-wise.json'
    const_data['s3'].getObject(temp_key, function (err, data) {

        if (err) {
            console.log(err);
        } else {
            const JSONdata = JSON.parse(data.Body.toString())
            var myDataPoint = [];
            var keys = Object.keys(JSONdata);
            for (let i = 0; i < keys.length; i++) {
                var data = {
                    value: (JSONdata[i].x_value),
                    label: (JSONdata[i].x_axis)
                };
                myDataPoint.push(data);
            }
           
            res.send(myDataPoint);
            logger.debug("Some debug messages");

        }

    })
})

app.get('/S3-all-school-wise', function (req, res) {

    logger.debug("Some debug messages");
    temp_key['Key']='Output/all-school-wise.json'
    const_data['s3'].getObject(temp_key, function (err, data) {
        
        if (err) {
            console.log(err);
        } else {
            const JSONdata = JSON.parse(data.Body.toString())
            var myDataPoint = [];
            var keys = Object.keys(JSONdata);
            for (let i = 0; i < keys.length; i++) {
                var data = {
                    value: (JSONdata[i].x_value),
                    label: (JSONdata[i].x_axis)
                };
                myDataPoint.push(data);
            }
            res.send(myDataPoint);
            logger.debug("Some debug messages");

        }

    })
})

app.get('/S3-kpi', function (req, res) {
    temp_key['Key']='Output/KPI.json'
    logger.debug("Some debug messages");
    const_data['s3'].getObject(temp_key, function (err, data) {

        if (err) {
            console.log(err);
        } else {
            const JSONdata = JSON.parse(data.Body.toString())
            
            res.send(JSONdata);

            logger.debug("Some debug messages");

        }

    })
});

app.get('/S3-gender-wise', function (req, res) {

    logger.debug("Some debug messages");
    temp_key['Key']='Output/gender-wise.json'
    const_data['s3'].getObject(temp_key, function (err, data) {
        
        if (err) {
            console.log(err);
        } else {
            const JSONdata = JSON.parse(data.Body.toString())
            var myDataPoint = [];
            var keys = Object.keys(JSONdata);
            for (let i = 0; i < keys.length; i++) {
                var data = {
                    value: (JSONdata[i].x_value),
                    label: (JSONdata[i].x_axis)
                };
                myDataPoint.push(data);
            }
            res.send(myDataPoint);
            logger.debug("Some debug messages");

        }

    })
})

app.listen(8091, function () {

    console.log("server is running on the port 8091")
})