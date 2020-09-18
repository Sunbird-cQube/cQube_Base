const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/blockWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Attendance block wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        let fileName = `attendance/block_attendance_opt_json_${year}_${month}.json`
        var jsonData = await s3File.readS3File(fileName);

        var blocksAttendanceData = jsonData.data
        var blockData = [];
        for (let i = 0; i < blocksAttendanceData.length; i++) {
            var obj = {
                block_id: blocksAttendanceData[i]['x_axis'],
                block_name: blocksAttendanceData[i]['block_name'],
                district_id: blocksAttendanceData[i]['district_id'],
                district_name: blocksAttendanceData[i]['district_name'],
                attendance: blocksAttendanceData[i]['x_value'],
                lat: blocksAttendanceData[i]['y_value'],
                lng: blocksAttendanceData[i]['z_value'],
                number_of_students: (blocksAttendanceData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                number_of_schools: (blocksAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            blockData.push(obj);
        }
        logger.info('--- Attendance block wise api response sent ---');
        res.status(200).send({ blockData: blockData, studentCount: jsonData.allBlocksFooter.students, schoolCount: jsonData.allBlocksFooter.schools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/blockPerDist', auth.authController, async (req, res) => {
    try {
        logger.info('---Attendance blockPerDist api ---');
        var distId = req.body.data.id;
        var month = req.body.data.month;
        var year = req.body.data.year;
        let fileName = `attendance/block_attendance_opt_json_${year}_${month}.json`
        var jsonData = await s3File.readS3File(fileName);
        var blockData = [];
        var filterData = jsonData.data.filter(data => {
            return (data.district_id == distId)
        });
        var blocksAttendanceData = filterData;
        for (let i = 0; i < blocksAttendanceData.length; i++) {
            var obj = {
                block_id: blocksAttendanceData[i]['x_axis'],
                block_name: blocksAttendanceData[i]['block_name'],
                district_id: blocksAttendanceData[i]['district_id'],
                district_name: blocksAttendanceData[i]['district_name'],
                attendance: blocksAttendanceData[i]['x_value'],
                lat: blocksAttendanceData[i]['y_value'],
                lng: blocksAttendanceData[i]['z_value'],
                number_of_students: (blocksAttendanceData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                number_of_schools: (blocksAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            blockData.push(obj);
        }
        logger.info('--- Attendance blockPerDist api response sent ---');
        res.status(200).send({ blockData: blockData, studentCount: jsonData.footer[distId].students, schoolCount: jsonData.footer[distId].schools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;