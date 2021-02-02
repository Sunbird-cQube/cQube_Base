const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/blockWise', auth.authController, async (req, res) => {
    try {
        logger.info(`---${req.body.report} block wise api ---`);
        var month = req.body.month;
        var year = req.body.year;
        var timePeriod = req.body.period;
        var report = req.body.report;
        let fileName;
        if (report == 'sarException') {
            if (timePeriod != null) {
                fileName = `exception_list/student_attendance_completion/${timePeriod}/block.json`;
            } else {
                fileName = `exception_list/student_attendance_completion/block_${year}_${month}.json`;
            }
        } else {
            fileName = `exception_list/teacher_attendance_completion/block_2019_1.json`;
        }
        var jsonData = await s3File.readS3File(fileName);
        var blocksAttendanceData = jsonData.data;
        var blockData = [];
        for (let i = 0; i < blocksAttendanceData.length; i++) {
            var obj = {
                block_id: blocksAttendanceData[i]['block_id'],
                block_name: blocksAttendanceData[i]['block_name'],
                district_id: blocksAttendanceData[i]['district_id'],
                district_name: blocksAttendanceData[i]['district_name'],
                attendance: blocksAttendanceData[i]['x_value'],
                lat: blocksAttendanceData[i]['block_latitude'],
                lng: blocksAttendanceData[i]['block_longitude'],
                total_schools_with_missing_data: (blocksAttendanceData[i]['total_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                total_number_of_schools: (blocksAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                percentage_schools_with_missing_data: (blocksAttendanceData[i]['percentage_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            blockData.push(obj);
        }
        logger.info(`---${req.body.report} block wise api response sent ---`);
        res.status(200).send({ blockData: blockData, missingSchoolsCount: jsonData.allBlocksFooter.total_schools_with_missing_data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/blockPerDist', auth.authController, async (req, res) => {
    try {
        logger.info(`---${req.body.report} blockPerDist api ---`);
        var distId = req.body.id;
        var month = req.body.month;
        var year = req.body.year;
        var timePeriod = req.body.period;
        var report = req.body.report;
        let fileName;
        if (report == 'sarException') {
            if (timePeriod != null) {
                fileName = `exception_list/student_attendance_completion/${timePeriod}/block.json`;
            } else {
                fileName = `exception_list/student_attendance_completion/block_${year}_${month}.json`;
            }
        } else {
            fileName = `exception_list/teacher_attendance_completion/block_2019_1.json`;
        }
        var jsonData = await s3File.readS3File(fileName);
        var blockData = [];
        var filterData = jsonData.data.filter(data => {
            return (data.district_id == distId)
        });
        var blocksAttendanceData = filterData;
        for (let i = 0; i < blocksAttendanceData.length; i++) {
            var obj = {
                block_id: blocksAttendanceData[i]['block_id'],
                block_name: blocksAttendanceData[i]['block_name'],
                district_id: blocksAttendanceData[i]['district_id'],
                district_name: blocksAttendanceData[i]['district_name'],
                attendance: blocksAttendanceData[i]['x_value'],
                lat: blocksAttendanceData[i]['block_latitude'],
                lng: blocksAttendanceData[i]['block_longitude'],
                total_schools_with_missing_data: (blocksAttendanceData[i]['total_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                total_number_of_schools: (blocksAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                percentage_schools_with_missing_data: (blocksAttendanceData[i]['percentage_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            blockData.push(obj);
        }
        logger.info(`---${req.body.report} blockPerDist api response sent ---`);
        res.status(200).send({ blockData: blockData, missingSchoolsCount: jsonData.footer[distId].total_schools_with_missing_data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;