const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/clusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Attendance cluster wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        let fileName = `attendance/cluster_attendance_opt_json_${year}_${month}.json`
        var jsonData = await s3File.readS3File(fileName);
        var clustersAttendanceData = jsonData.data
        var clusterData = [];
        for (let i = 0; i < clustersAttendanceData.length; i++) {
            var obj = {
                cluster_id: clustersAttendanceData[i]['x_axis'],
                cluster_name: clustersAttendanceData[i]['cluster_name'],
                block_id: clustersAttendanceData[i]['block_id'],
                block_name: clustersAttendanceData[i]['block_name'],
                district_id: clustersAttendanceData[i]['district_id'],
                district_name: clustersAttendanceData[i]['district_name'],
                attendance: clustersAttendanceData[i]['x_value'],
                lat: clustersAttendanceData[i]['y_value'],
                lng: clustersAttendanceData[i]['z_value'],
                number_of_students: (clustersAttendanceData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                number_of_schools: (clustersAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            }
            clusterData.push(obj);
        }
        logger.info('--- Attendance cluster wise api response sent ---');
        res.status(200).send({ clusterData: clusterData, studentCount: jsonData.allClustersFooter.students, schoolCount: jsonData.allClustersFooter.schools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterPerBlock', auth.authController, async (req, res) => {
    try {
        logger.info('---Attendance clusterPerBlock api ---');
        var blockId = req.body.data.id;
        var month = req.body.data.month;
        var year = req.body.data.year;
        let fileName = `attendance/cluster_attendance_opt_json_${year}_${month}.json`
        var jsonData = await s3File.readS3File(fileName);
        var clusterData = [];
        var filterData = jsonData.data.filter(data => {
            return (data.block_id == blockId)
        });
        var clustersAttendanceData = filterData;
        for (let i = 0; i < clustersAttendanceData.length; i++) {
            var obj = {
                cluster_id: clustersAttendanceData[i]['x_axis'],
                cluster_name: clustersAttendanceData[i]['cluster_name'],
                block_id: clustersAttendanceData[i]['block_id'],
                block_name: clustersAttendanceData[i]['block_name'],
                district_id: clustersAttendanceData[i]['district_id'],
                district_name: clustersAttendanceData[i]['district_name'],
                attendance: clustersAttendanceData[i]['x_value'],
                lat: clustersAttendanceData[i]['y_value'],
                lng: clustersAttendanceData[i]['z_value'],
                number_of_students: (clustersAttendanceData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                number_of_schools: (clustersAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            }
            clusterData.push(obj);
        }
        logger.info('--- Attendance clusterPerDist api response sent ---');
        res.status(200).send({ clusterDetails: clusterData, studentCount: jsonData.footer[blockId].students, schoolCount: jsonData.footer[blockId].schools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;