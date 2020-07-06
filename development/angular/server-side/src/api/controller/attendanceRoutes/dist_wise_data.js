const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('./reads3File');

router.post('/distWise', async function (req, res) {
    try {
        logger.info('---Attendance dist wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        let fileName = `attendance/district_attendance_opt_json_${year}_${month}.json`
        var jsonData = await s3File.readS3File(fileName);
        var districtAttendanceData = jsonData.data
        var distData = [];
        for (let i = 0; i < districtAttendanceData.length; i++) {
            var obj = {
                id: districtAttendanceData[i]['x_axis'],
                name: districtAttendanceData[i]['district_name'],
                label: districtAttendanceData[i]['x_value'],
                lat: districtAttendanceData[i]['y_value'],
                lng: districtAttendanceData[i]['z_value'],
                stdCount: (districtAttendanceData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                schCount: (districtAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            distData.push(obj);
        }
        logger.info('--- Attendance dist wise api response sent ---');
        res.status(200).send({ distData: distData, studentCount: jsonData.allDistrictsFooter.students, schoolCount: jsonData.allDistrictsFooter.schools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;