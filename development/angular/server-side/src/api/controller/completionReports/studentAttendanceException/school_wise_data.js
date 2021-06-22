const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/schoolWise', auth.authController, async function (req, res) {
    try {
        logger.info(`---${req.body.report} school wise api ---`);
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
                    fileName = `exception_list/student_attendance_completion/school_management_category/${timePeriod}/overall_category/${management}/school.json`;
                } else {
                    fileName = `exception_list/student_attendance_completion/school_management_category/overall_category/${management}/school_${year}_${month}.json`;
                }
            } else {
                if (timePeriod != null) {
                    fileName = `exception_list/student_attendance_completion/${timePeriod}/school.json`;
                } else {
                    fileName = `exception_list/student_attendance_completion/school_${year}_${month}.json`;
                }
            }
        } else {
            if (management != 'overall' && category == 'overall') {
                if (timePeriod != null) {
                    fileName = `exception_list/teacher_attendance_completion/school_management_category/${timePeriod}/overall_category/${management}/school.json`;
                } else {
                    fileName = `exception_list/teacher_attendance_completion/school_management_category/overall_category/${management}/school_${year}_${month}.json`;
                }
            } else {
                if (timePeriod != null) {
                    fileName = `exception_list/teacher_attendance_completion/${timePeriod}/school.json`;
                } else {
                    fileName = `exception_list/teacher_attendance_completion/school_${year}_${month}.json`;
                }
            }
        }
        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var schoolsAttendanceData = jsonData.data
        var dateRange = `${schoolsAttendanceData[0]['data_from_date']} to ${schoolsAttendanceData[0]['data_upto_date']}`;
        var schoolData = [];
        for (let i = 0; i < schoolsAttendanceData.length; i++) {
            var obj = {
                school_id: schoolsAttendanceData[i]['school_id'],
                school_name: schoolsAttendanceData[i]['school_name'],
                cluster_id: schoolsAttendanceData[i]['cluster_id'],
                cluster_name: schoolsAttendanceData[i]['cluster_name'],
                block_id: schoolsAttendanceData[i]['block_id'],
                block_name: schoolsAttendanceData[i]['block_name'],
                district_id: schoolsAttendanceData[i]['district_id'],
                district_name: schoolsAttendanceData[i]['district_name'],
                attendance: schoolsAttendanceData[i]['x_value'],
                lat: schoolsAttendanceData[i]['school_latitude'],
                lng: schoolsAttendanceData[i]['school_longitude'],
                total_schools_with_missing_data: (schoolsAttendanceData[i]['total_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            }
            schoolData.push(obj);
        }
        logger.info(`---${req.body.report} school wise api response sent ---`);
        res.status(200).send({ schoolData: schoolData, missingSchoolsCount: jsonData.allSchoolsFooter.total_schools_with_missing_data, dateRange: dateRange });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolPerCluster', auth.authController, async (req, res) => {
    try {
        logger.info(`---${req.body.report} schoolPerCluster api ---`);

        var clusterId = req.body.id;
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
                    fileName = `exception_list/student_attendance_completion/school_management_category/${timePeriod}/overall_category/${management}/school.json`;
                } else {
                    fileName = `exception_list/student_attendance_completion/school_management_category/overall_category/${management}/school_${year}_${month}.json`;
                }
            } else {
                if (timePeriod != null) {
                    fileName = `exception_list/student_attendance_completion/${timePeriod}/school.json`;
                } else {
                    fileName = `exception_list/student_attendance_completion/school_${year}_${month}.json`;
                }
            }
        } else {
            if (management != 'overall' && category == 'overall') {
                if (timePeriod != null) {
                    fileName = `exception_list/teacher_attendance_completion/school_management_category/${timePeriod}/overall_category/${management}/school.json`;
                } else {
                    fileName = `exception_list/teacher_attendance_completion/school_management_category/overall_category/${management}/school_${year}_${month}.json`;
                }
            } else {
                if (timePeriod != null) {
                    fileName = `exception_list/teacher_attendance_completion/${timePeriod}/school.json`;
                } else {
                    fileName = `exception_list/teacher_attendance_completion/school_${year}_${month}.json`;
                }
            }
        }

        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var schoolsDetails = [];
        var filterData = jsonData.data.filter(data => {
            return (data.cluster_id == clusterId)
        });
        var schoolsAttendanceData = filterData;
        var dateRange = `${schoolsAttendanceData[0]['data_from_date']} to ${schoolsAttendanceData[0]['data_upto_date']}`;
        for (let i = 0; i < schoolsAttendanceData.length; i++) {
            var obj = {
                school_id: schoolsAttendanceData[i]['school_id'],
                school_name: schoolsAttendanceData[i]['school_name'],
                cluster_id: schoolsAttendanceData[i]['cluster_id'],
                cluster_name: schoolsAttendanceData[i]['cluster_name'],
                block_id: schoolsAttendanceData[i]['block_id'],
                block_name: schoolsAttendanceData[i]['block_name'],
                district_id: schoolsAttendanceData[i]['district_id'],
                district_name: schoolsAttendanceData[i]['district_name'],
                attendance: schoolsAttendanceData[i]['x_value'],
                lat: schoolsAttendanceData[i]['school_latitude'],
                lng: schoolsAttendanceData[i]['school_longitude'],
                total_schools_with_missing_data: (schoolsAttendanceData[i]['total_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            }
            schoolsDetails.push(obj);
        }
        logger.info(`---${req.body.report} schoolPerCluster api response sent ---`);
        res.status(200).send({ schoolsDetails: schoolsDetails, missingSchoolsCount: jsonData.footer[clusterId].total_schools_with_missing_data, dateRange: dateRange });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }

});

module.exports = router;