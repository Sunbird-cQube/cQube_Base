const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

router.post('/distWise', auth.authController, function (req, res) {
    try {
        logger.info('---Attendance dist wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        const_data['getParams']['Key'] = `attendance/district_attendance_${year}_${month}.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.send([]);
            } else if (!data) {
                logger.info("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                logger.info('--- Attendance dist wise api response sent ---');
                res.send(data.Body);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
});

module.exports = router;