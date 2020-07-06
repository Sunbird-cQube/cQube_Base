const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('./reads3File');

router.post('/clusterWise', async (req, res) => {
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
                id: clustersAttendanceData[i]['x_axis'],
                name: clustersAttendanceData[i]['cluster_name'],
                distId: clustersAttendanceData[i]['district_id'],
                dist: clustersAttendanceData[i]['district_name'],
                blockId: clustersAttendanceData[i]['block_id'],
                block: clustersAttendanceData[i]['block_name'],
                label: clustersAttendanceData[i]['x_value'],
                lat: clustersAttendanceData[i]['y_value'],
                lng: clustersAttendanceData[i]['z_value'],
                stdCount: (clustersAttendanceData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                schCount: (clustersAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
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

router.post('/clusterPerBlock', async (req, res) => {
    try {
        logger.info('---Attendance clusterPerDist api ---');
        console.log(req.body);``
        var blockId = req.body.data.id;
        var month = req.body.data.month;
        var year = req.body.data.year;
        let fileName = `attendance/cluster_attendance_opt_json_${year}_${month}.json`
        var jsonData = await s3File.readS3File(fileName);
        var clusterData = [];
        var filterData = jsonData.data.filter(data => {
            return (data.block_id == blockId)
        });
        var myData = filterData;
        for (let i = 0; i < myData.length; i++) {
            var obj = {
                id: myData[i]['x_axis'],
                name: myData[i]['cluster_name'],
                distId: myData[i]['district_id'],
                dist: myData[i]['district_name'],
                blockId: myData[i]['block_id'],
                block: myData[i]['block_name'],
                label: myData[i]['x_value'],
                lat: myData[i]['y_value'],
                lng: myData[i]['z_value'],
                stdCount: (myData[i]['students_count']),
                schCount: (myData[i]['total_schools']),
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