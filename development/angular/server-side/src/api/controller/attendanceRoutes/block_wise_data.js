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
                var myData = JSON.parse(data.Body.toString());
                for (let i = 0; i < myData.length; i++) {
                    studentCount = studentCount + Number(myData[i]['students_count']);
                    schoolCount = schoolCount + Number(myData[i]['total_schools']);
                    var obj = {
                        id: myData[i]['x_axis'],
                        distId: myData[i]['district_id'],
                        dist: myData[i]['district_name'],
                        name: myData[i]['block_name'],
                        label: myData[i]['x_value'],
                        lat: myData[i]['y_value'],
                        lng: myData[i]['z_value'],
                        stdCount: (myData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        schCount: (myData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                    }
                    blockData.push(obj);
                };
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
            var filterData = allBlocks.data.blockData.filter(data => {
                return (data.distId == distId)
            });
            var myData = filterData;
            for (let i = 0; i < myData.length; i++) {
                studentCount = studentCount + Number(myData[i].stdCount.replace(/\,/g, ''));
                schoolCount = schoolCount + Number(myData[i].schCount.replace(/\,/g, ''));
                var obj = {
                    id: myData[i]['id'],
                    name: myData[i]['name'],
                    dist: myData[i]['dist'],
                    label: myData[i]['label'],
                    lat: myData[i]['lat'],
                    lng: myData[i]['lng'],
                    stdCount: (myData[i]['stdCount']),
                    schCount: (myData[i]['schCount']),
                }
                blockData.push(obj);
            }
            logger.info('--- Attendance blockPerDist api response sent ---');
            res.status(200).send({ blockData: blockData, studentCount: studentCount, schoolCount: schoolCount });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;