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
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                logger.info('--- Attendance dist wise api response sent ---');
                var studentCount = 0;
                var schoolCount = 0;
                var distData = [];
                JSON.parse(data.Body.toString()).map(item => {
                    studentCount = studentCount + Number(item['students_count']);
                    schoolCount = schoolCount + Number(item['total_schools']);
                    var obj = {
                        id: item['x_axis'],
                        name: item['district_name'],
                        label: item['x_value'],
                        lat: item['y_value'],
                        lng: item['z_value'],
                        stdCount: (item['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        schCount: (item['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                    }
                    distData.push(obj);
                });
                res.status(200).send({ distData: distData, studentCount: studentCount, schoolCount: schoolCount });
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;