const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/distWise', auth.authController, async function (req, res) {
    try {
        logger.info('---Attendance dist wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        var timePeriod = req.body.period;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category != 'overall') {
            if (timePeriod != null) {
                fileName = `attendance/${timePeriod}/school_management_category/${management}/${category}/district.json`;
            } else {
                fileName = `attendance/school_management_category/${management}/${category}/district_${year}_${month}.json`;
            }
        } else if (management == 'overall' && category != 'overall') {
            if (timePeriod != null) {
                fileName = `attendance/${timePeriod}/school_management_category/overall_management/${category}/district.json`;
            } else {
                fileName = `attendance/school_management_category/${year}/${month}/overall_management${category}/district.json`;
            }
        } else if (management != 'overall' && category == 'overall') {
            if (timePeriod != null) {
                fileName = `attendance/${timePeriod}/school_management_category/overall_category/${management}/district.json`;
            } else {
                fileName = `attendance/school_management_category/${year}/${month}/overall_category/${management}/district.json`;
            }
        } else {
            if (timePeriod != null) {
                fileName = `attendance/${timePeriod}/district.json`;
            } else {
                fileName = `attendance/${year}/${month}/district.json`;
            }
        }
        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var districtAttendanceData = jsonData.data
        var dateRange = `${districtAttendanceData[0]['data_from_date']} to ${districtAttendanceData[0]['data_upto_date']}`;
        var distData = [];
        for (let i = 0; i < districtAttendanceData.length; i++) {
            var obj = {
                district_id: districtAttendanceData[i]['x_axis'],
                district_name: districtAttendanceData[i]['district_name'],
                attendance: districtAttendanceData[i]['x_value'],
                lat: districtAttendanceData[i]['y_value'],
                lng: districtAttendanceData[i]['z_value'],
                number_of_students: (districtAttendanceData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                number_of_schools: (districtAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            distData.push(obj);
        }
        logger.info('--- Attendance dist wise api response sent ---');
        res.status(200).send({ distData: distData, studentCount: jsonData.allDistrictsFooter.students, schoolCount: jsonData.allDistrictsFooter.schools, dateRange: dateRange });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;