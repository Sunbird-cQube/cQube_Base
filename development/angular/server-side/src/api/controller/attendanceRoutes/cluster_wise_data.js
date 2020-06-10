const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const axios = require('axios');
const auth = require('../../middleware/check-auth');

router.post('/clusterWise', auth.authController, function (req, res) {
    try {
        logger.info('---Attendance cluster wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        const_data['getParams']['Key'] = `attendance/cluster_attendance_${year}_${month}.json`;
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
                var clusterData = [];
                JSON.parse(data.Body.toString()).map(item => {
                    studentCount = studentCount + Number(item['students_count']);
                    schoolCount = schoolCount + Number(item['total_schools']);
                    var obj = {
                        id: item['x_axis'],
                        name: item['cluster_name'],
                        distId: item['district_id'],
                        dist: item['district_name'],
                        blockId: item['block_id'],
                        block: item['block_name'],
                        label: item['x_value'],
                        lat: item['y_value'],
                        lng: item['z_value'],
                        stdCount: (item['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        schCount: (item['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                    }
                    clusterData.push(obj);
                });
                logger.info('--- Attendance cluster wise api response sent ---');
                res.status(200).send({ clusterData: clusterData, studentCount: studentCount, schoolCount: schoolCount });
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterPerBlock', auth.authController, async (req, res) => {
    try {
        logger.info('---Attendance clusterPerBlock api ---');
        var blockId = req.body.data.id;
        var baseUrl = req.body.baseUrl;
        var token = req.headers.token;
        var month = req.body.data.month;
        var year = req.body.data.year;

        var allClusters = await axios.post(`${baseUrl}/attendance/clusterWise`, { month: month, year: year }, { 'headers': { 'token': "Bearer" + token } });

        var clusterDetails = [];
        if (allClusters.data['errMsg']) {
            res.status(500).json({ errMsg: "Something went wrong" });
        } else {
            var studentCount = 0;
            var schoolCount = 0;
            allClusters.data.clusterData.map(clusters => {
                if (blockId === clusters.blockId) {
                    studentCount = studentCount + Number(clusters.stdCount.replace(/\,/g, ''));
                    schoolCount = schoolCount + Number(clusters.schCount.replace(/\,/g, ''));
                    obj = {
                        id: clusters['id'],
                        name: clusters['name'],
                        distId: clusters['distId'],
                        dist: clusters['dist'],
                        blockId: clusters['blockId'],
                        block: clusters['block'],
                        label: clusters['label'],
                        lat: clusters['lat'],
                        lng: clusters['lng'],
                        stdCount: (clusters['stdCount']),
                        schCount: (clusters['schCount']),
                    }
                    clusterDetails.push(obj);
                }

            });
            await logger.info('--- Attendance clusterPerBlock api response sent ---');
            res.status(200).send({ clusterDetails: clusterDetails, studentCount: studentCount, schoolCount: schoolCount });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;