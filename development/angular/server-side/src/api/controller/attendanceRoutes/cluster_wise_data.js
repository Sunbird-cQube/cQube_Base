const router = require('express').Router();
var const_data = require('../../lib/config');
const auth = require('../../middleware/check-auth');

router.post('/', auth.authController, function (req, res) {
    var month = req.body.month;
    var year = req.body.year;
    const_data['getParams']['Key'] = `attendance/cluster_attendance_${year}_${month}.json`;
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