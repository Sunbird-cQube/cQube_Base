const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');

router.post('/stdAttendance', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summary/log_summary_student_attendance.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                summaryData.forEach(data1 => {
                    data1.process_start_time = new Date(parseInt(data1.process_start_time))
                    data1.process_end_time = new Date(parseInt(data1.process_end_time))
                });
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/sem', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summay/log_summary_sem.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                summaryData.forEach(data1 => {
                    data1.process_start_time = new Date(parseInt(data1.process_start_time))
                    data1.process_end_time = new Date(parseInt(data1.process_end_time))
                });
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});


module.exports = router