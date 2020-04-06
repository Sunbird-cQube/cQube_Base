const router = require('express').Router();
var const_data = require('../config/aws-config');
const auth = require('../middleware/check-auth');

router.get('/', auth.authController, function (req, res) {
    const_data['getParams']['Key'] = 'state-wise-count.json'
    const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
        if (err) {
            // console.log(err);
            res.send([]);
        } else if (!data) {
            console.log("Something went wrong or s3 file not found");
            res.send([]);
        } else {
            res.send(data.Body);
        }
    });
});

module.exports = router;