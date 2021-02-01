const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/schoolWise', auth.authController, async function (req, res) {
    try {
        logger.info('--- Attendance school wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        let fileName = `teacher_attendance/school_${year}_${month}.json`;
        var jsonData = await s3File.readS3File(fileName);
        var schoolsAttendanceData = jsonData.data;
        var dateRange = `${schoolsAttendanceData[0]['data_from_date']} to ${schoolsAttendanceData[0]['data_upto_date']}`;
        var schoolData = [];
        for (let i = 0; i < schoolsAttendanceData.length; i++) {
            var obj = {
                school_id: schoolsAttendanceData[i]['x_axis'],
                school_name: schoolsAttendanceData[i]['school_name'],
                cluster_id: schoolsAttendanceData[i]['cluster_id'],
                cluster_name: schoolsAttendanceData[i]['cluster_name'],
                block_id: schoolsAttendanceData[i]['block_id'],
                block_name: schoolsAttendanceData[i]['block_name'],
                district_id: schoolsAttendanceData[i]['district_id'],
                district_name: schoolsAttendanceData[i]['district_name'],
                attendance: schoolsAttendanceData[i]['x_value'],
                lat: schoolsAttendanceData[i]['y_value'],
                lng: schoolsAttendanceData[i]['z_value'],
                number_of_teachers: schoolsAttendanceData[i]['teachers_count'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            schoolData.push(obj);
        }
        logger.info('--- Attendance school wise api response sent ---');
        res.status(200).send({ schoolData: schoolData, teacherCount: jsonData.allSchoolsFooter.teachers, schoolCount: jsonData.allSchoolsFooter.schools, dateRange: dateRange });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolPerCluster', auth.authController, async (req, res) => {
    try {
        logger.info('--- Attendance schoolPerCluster api ---');

        var clusterId = req.body.data.id;
        var month = req.body.data.month;
        var year = req.body.data.year;
        let fileName = `teacher_attendance/school_${year}_${month}.json`;
        var jsonData = await s3File.readS3File(fileName);
        // res.send(jsonData)
        var schoolsDetails = [];
        var filterData = jsonData.data.filter(data => {
            return (data.cluster_id == clusterId)
        });
        var schoolsAttendanceData = filterData;
        var dateRange = `${schoolsAttendanceData[0]['data_from_date']} to ${schoolsAttendanceData[0]['data_upto_date']}`;
        for (let i = 0; i < schoolsAttendanceData.length; i++) {
            var obj = {
                school_id: schoolsAttendanceData[i]['x_axis'],
                school_name: schoolsAttendanceData[i]['school_name'],
                cluster_id: schoolsAttendanceData[i]['cluster_id'],
                cluster_name: schoolsAttendanceData[i]['cluster_name'],
                block_id: schoolsAttendanceData[i]['block_id'],
                block_name: schoolsAttendanceData[i]['block_name'],
                district_id: schoolsAttendanceData[i]['district_id'],
                district_name: schoolsAttendanceData[i]['district_name'],
                attendance: schoolsAttendanceData[i]['x_value'],
                lat: schoolsAttendanceData[i]['y_value'],
                lng: schoolsAttendanceData[i]['z_value'],
                number_of_teachers: schoolsAttendanceData[i]['teachers_count'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            schoolsDetails.push(obj);
        }
        logger.info('--- Attendance schoolPerCluster api response sent ---');
        res.status(200).send({ schoolsDetails: schoolsDetails, teacherCount: jsonData.footer[clusterId].teachers, schoolCount: jsonData.footer[clusterId].schools, dateRange: dateRange });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }

});

module.exports = router;