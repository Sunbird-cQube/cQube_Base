const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/distWise', auth.authController, async function (req, res) {
    try {
        logger.info(`---${req.body.report}  dist wise api ---`);
        var month = req.body.month;
        var year = req.body.year;
        var timePeriod = req.body.period;
        var report = req.body.report;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;

        if (report == 'sarException') {
            if (management != 'overall' && category == 'overall') {
                if (timePeriod != null) {
                    fileName = `exception_list/student_attendance_completion/school_management_category/${timePeriod}/overall_category/${management}/district.json`;
                } else {
                    fileName = `exception_list/student_attendance_completion/school_management_category/overall_category/${management}/district_${year}_${month}.json`;
                }
            } else {
                if (timePeriod != null) {
                    fileName = `exception_list/student_attendance_completion/${timePeriod}/district.json`;
                } else {
                    fileName = `exception_list/student_attendance_completion/district_${year}_${month}.json`;
                }
            }
        } else {
            if (management != 'overall' && category == 'overall') {
                if (timePeriod != null) {
                    fileName = `exception_list/teacher_attendance_completion/school_management_category/${timePeriod}/overall_category/${management}/district.json`;
                } else {
                    fileName = `exception_list/teacher_attendance_completion/school_management_category/overall_category/${management}/district_${year}_${month}.json`;
                }
            } else {
                if (timePeriod != null) {
                    fileName = `exception_list/teacher_attendance_completion/${timePeriod}/district.json`;
                } else {
                    fileName = `exception_list/teacher_attendance_completion/district_${year}_${month}.json`;
                }
            }
        }
        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var districtAttendanceData = jsonData.data;
        var dateRange = `${districtAttendanceData[0]['data_from_date']} to ${districtAttendanceData[0]['data_upto_date']}`;
        var distData = [];
        for (let i = 0; i < districtAttendanceData.length; i++) {
            var obj = {
                district_id: districtAttendanceData[i]['district_id'],
                district_name: districtAttendanceData[i]['district_name'],
                attendance: districtAttendanceData[i]['x_value'],
                lat: districtAttendanceData[i]['district_latitude'],
                lng: districtAttendanceData[i]['district_longitude'],
                total_schools_with_missing_data: (districtAttendanceData[i]['total_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                total_number_of_schools: (districtAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                percentage_schools_with_missing_data: (districtAttendanceData[i]['percentage_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            distData.push(obj);
        }
        logger.info(`--- ${req.body.report} dist wise api response sent ---`);
        res.status(200).send({ distData: distData, missingSchoolsCount: jsonData.allDistrictsFooter.total_schools_with_missing_data, dateRange: dateRange });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;