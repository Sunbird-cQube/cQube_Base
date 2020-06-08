const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const axios = require('axios');
const auth = require('../../middleware/check-auth');

router.post('/blockWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Attendance block wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        const_data['getParams']['Key'] = `attendance/block_attendance_${year}_${month}.json`;
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                var studentCount = 0;
                var schoolCount = 0;
                var blockData = [];
                JSON.parse(data.Body.toString()).forEach(item => {
                    studentCount = studentCount + Number(item['students_count']);
                    schoolCount = schoolCount + Number(item['total_schools']);
                    var obj = {
                        id: item['x_axis'],
                        distId: item['district_id'],
                        dist: item['district_name'],
                        name: item['block_name'],
                        label: item['x_value'],
                        lat: item['y_value'],
                        lng: item['z_value'],
                        stdCount: (item['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        schCount: (item['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                    }
                    blockData.push(obj);
                });
                logger.info('--- Attendance block wise api response sent ---');
                res.status(200).send({ blockData: blockData, studentCount: studentCount, schoolCount: schoolCount });
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/blockPerDist', auth.authController, async (req, res) => {
    try {
        logger.info('---Attendance blockPerDist api ---');
        var distId = req.body.data.id;
        var baseUrl = req.body.baseUrl;
        var token = req.headers.token;
        var month = req.body.data.month;
        var year = req.body.data.year;
        var allBlocks = await axios.post(`${baseUrl}/attendance/blockWise`, { month: month, year: year }, { 'headers': { 'token': "Bearer" + token } });
        if (allBlocks.data['errMsg']) {
            res.status(500).json({ errMsg: "Something went wrong" });
        } else {
            var studentCount = 0;
            var schoolCount = 0;
            var blockData = [];
            allBlocks.data.blockData.forEach(blocks => {
                if (distId === blocks.distId) {
                    studentCount = studentCount + Number(blocks.stdCount.replace(/\,/g, ''));
                    schoolCount = schoolCount + Number(blocks.schCount.replace(/\,/g, ''));
                    obj = {
                        id: blocks['id'],
                        name: blocks['name'],
                        dist: blocks['dist'],
                        label: blocks['label'],
                        lat: blocks['lat'],
                        lng: blocks['lng'],
                        stdCount: (blocks['stdCount']),
                        schCount: (blocks['schCount']),
                    }
                    blockData.push(obj);
                }
            })
            logger.info('--- Attendance blockPerDist api response sent ---');
            res.status(200).send({ blockData: blockData, studentCount: studentCount, schoolCount: schoolCount });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;