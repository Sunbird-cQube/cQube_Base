const router = require('express').Router();
var const_data = require('../../lib/config');
const auth = require('../../middleware/check-auth');

router.get('/', auth.authController, function (req, res) {
    const_data['getParams']['Key'] = '3m_data/school_master_lat_long.json'
    const_data['s3'].getObject(const_data['getParams'], function (err, result) {
        if (err) {
            console.log(err);
            res.send([]);
        } else if (!result) {
            console.log("Something went wrong or s3 file not found");
            res.send([]);
        } else {
            var mydata = result.Body.toString();
            // console.log(JSON.parse(mydata)[0]);
            res.send(JSON.parse(mydata));
        }
    });
});

module.exports = router;