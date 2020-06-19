const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

router.post('/distWise', function (req, res) {
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
                var studentCount = 0;
                var schoolCount = 0;
                var distData = [];
                var myData = JSON.parse(data.Body.toString());
                for (let i = 0; i < myData.length; i++) {
                    studentCount = studentCount + Number(myData[i]['students_count']);
                    schoolCount = schoolCount + Number(myData[i]['total_schools']);
                    var obj = {
                        id: myData[i]['x_axis'],
                        name: myData[i]['district_name'],
                        label: myData[i]['x_value'],
                        lat: myData[i]['y_value'],
                        lng: myData[i]['z_value'],
                        stdCount: (myData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        schCount: (myData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                    }
                    distData.push(obj);
                }
                logger.info('--- Attendance dist wise api response sent ---');
                res.status(200).send({ distData: distData, studentCount: studentCount, schoolCount: schoolCount });
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;