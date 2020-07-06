const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('./reads3File');

router.post('/schoolWise', auth.authController, async function (req, res) {
    try {
        logger.info('--- Attendance school wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        let fileName = `attendance/school_attendance_opt_json_${year}_${month}.json`
        var jsonData = await s3File.readS3File(fileName);
        var schoolsAttendanceData = jsonData.data
        var schoolData = [];
        for (let i = 0; i < schoolsAttendanceData.length; i++) {
            var obj = {
                id: schoolsAttendanceData[i]['x_axis'],
                cluster: schoolsAttendanceData[i]['cluster_name'],
                clusterId: schoolsAttendanceData[i]['cluster_id'],
                distId: schoolsAttendanceData[i]['district_id'],
                blockId: schoolsAttendanceData[i]['block_id'],
                dist: schoolsAttendanceData[i]['district_name'],
                block: schoolsAttendanceData[i]['block_name'],
                name: schoolsAttendanceData[i]['school_name'],
                label: schoolsAttendanceData[i]['x_value'],
                lat: schoolsAttendanceData[i]['y_value'],
                lng: schoolsAttendanceData[i]['z_value'],
                stdCount: schoolsAttendanceData[i]['students_count'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                schCount: schoolsAttendanceData[i]['total_schools'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            }
            schoolData.push(obj);
        }
        logger.info('--- Attendance school wise api response sent ---');
        res.status(200).send({ schoolData: schoolData, studentCount: jsonData.allSchoolsFooter.students, schoolCount: jsonData.allSchoolsFooter.schools });
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
        let fileName = `attendance/school_attendance_opt_json_${year}_${month}.json`
        var jsonData = await s3File.readS3File(fileName);
        // res.send(jsonData)
        var schoolsDetails = [];
        var filterData = jsonData.data.filter(data => {
            return (data.cluster_id == clusterId)
        });
        var schoolsAttendanceData = filterData;
        for (let i = 0; i < schoolsAttendanceData.length; i++) {
            var obj = {
                id: schoolsAttendanceData[i]['x_axis'],
                cluster: schoolsAttendanceData[i]['cluster_name'],
                clusterId: schoolsAttendanceData[i]['cluster_id'],
                distId: schoolsAttendanceData[i]['district_id'],
                blockId: schoolsAttendanceData[i]['block_id'],
                dist: schoolsAttendanceData[i]['district_name'],
                block: schoolsAttendanceData[i]['block_name'],
                name: schoolsAttendanceData[i]['school_name'],
                label: schoolsAttendanceData[i]['x_value'],
                lat: schoolsAttendanceData[i]['y_value'],
                lng: schoolsAttendanceData[i]['z_value'],
                stdCount: (schoolsAttendanceData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                schCount: (schoolsAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            }
            schoolsDetails.push(obj);
        }
        logger.info('--- Attendance schoolPerCluster api response sent ---');
        res.status(200).send({ schoolsDetails: schoolsDetails, studentCount: jsonData.footer[clusterId].students, schoolCount: jsonData.footer[clusterId].schools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }

});

module.exports = router;