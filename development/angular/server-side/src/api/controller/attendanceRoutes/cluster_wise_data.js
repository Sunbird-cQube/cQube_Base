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
                logger.info('--- Attendance cluster wise api response sent ---');
                res.status(200).send(data.Body);
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
            allClusters.data.forEach(clusters => {
                if (blockId === clusters.block_id) {
                    obj = {
                        x_axis: clusters.x_axis,
                        blockId: clusters.block_id,
                        blockName: clusters.block_name,
                        distId: clusters.district_id,
                        distName: clusters.district_name,
                        cluster_name: clusters.cluster_name,
                        x_value: clusters.x_value,
                        y_value: clusters.y_value,
                        z_value: clusters.z_value,
                        students_count: clusters.students_count,
                        total_schools: clusters.total_schools
                    }
                    clusterDetails.push(obj);
                }

            });
            await logger.info('--- Attendance clusterPerBlock api response sent ---');
            res.status(200).send(clusterDetails);
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;