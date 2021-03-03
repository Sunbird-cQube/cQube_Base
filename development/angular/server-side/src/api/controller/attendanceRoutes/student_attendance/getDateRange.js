const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const groupArray = require('group-array');
const s3File = require('../../../lib/reads3File');

router.get('/getDateRange', auth.authController, function (req, res) {
    try {
        logger.info('---getDateRange api ---');
        const_data['getParams']['Key'] = `attendance/student_attendance_meta.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let dateObj = data.Body.toString();
                dateObj = JSON.parse(dateObj);
                let date = groupArray(dateObj, 'year')
                logger.info('--- getDateRange response sent ---');
                res.status(200).send(date);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/rawMeta', auth.authController, function (req, res) {
    try {
        var report = req.body.report;
        logger.info('---raw data download meta api ---');
        const_data['getParams']['Key'] = (report == 'sar') ? `attendance/raw/metaData.json` : `teacher_attendance/raw/metaData.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let dateObj = data.Body.toString();
                dateObj = JSON.parse(dateObj);
                let academic_years = [];
                dateObj.map(i => {
                    academic_years.push(i.academic_year);
                })
                logger.info('--- raw data download meta response sent ---');
                res.status(200).send(academic_years);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});


module.exports = router;