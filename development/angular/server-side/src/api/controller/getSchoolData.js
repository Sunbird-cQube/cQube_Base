const router = require('express').Router();
var const_data = require('../config/aws-config');

router.get('/', function (req, res) {
    const_data['getParams']['Key'] = 'static/school_master_lat_long.json'
    const_data['s3'].getObject(const_data['getParams'], function (err, result) {
        if (err) {
            // console.log(err);
            res.send([]);
        } else if (!data) {
            console.log("Something went wrong or s3 file not found");
            res.send([]);
        } else {
            var mydata = result.Body.toString();
            res.send(JSON.parse(mydata));
        }
    });
});

module.exports = router;