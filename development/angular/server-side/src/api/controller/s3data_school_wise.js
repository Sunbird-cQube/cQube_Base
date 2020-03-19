const router = require('express').Router();
var log4js = require('log4js');
var logger = log4js.getLogger();

var const_data = require('../config/aws-config');

router.get('/', function (req, res) {

    logger.debug("Some debug messages");
    const_data['getParams']['Key']='Output/all-school-wise.json'
    const_data['s3'].getObject(const_data['getParams'], function (err, data) {
        
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
});

module.exports = router;