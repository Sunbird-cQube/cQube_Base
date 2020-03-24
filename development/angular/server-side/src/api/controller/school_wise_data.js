const router = require('express').Router();
var log4js = require('log4js');

var const_data = require('../config/aws-config');

router.get('/', function (req, res) {
    const_data['getParams']['Key'] = 'school-wise-percentage.json'
    const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
        if (err) {
            console.log(err);
        } else {
            const JSONdata = JSON.parse(data.Body.toString());
            res.send(JSONdata);
        }
    });
});

module.exports = router;