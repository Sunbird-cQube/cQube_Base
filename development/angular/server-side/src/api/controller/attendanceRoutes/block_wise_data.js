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
                logger.info('--- Attendance block wise api response sent ---');
                res.status(200).send(data.Body);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" });
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
            var blcokDetails = [];
            allBlocks.data.forEach(blocks => {
                if (distId === blocks.district_id) {
                    obj = {
                        x_axis: blocks.x_axis,
                        distId: blocks.district_id,
                        distName: blocks.district_name,
                        block_name: blocks.block_name,
                        x_value: blocks.x_value,
                        y_value: blocks.y_value,
                        z_value: blocks.z_value,
                        students_count: blocks.students_count,
                        total_schools: blocks.total_schools
                    }
                    blcokDetails.push(obj);
                }
            })
            logger.info('--- Attendance blockPerDist api response sent ---');
            res.status(200).send(blcokDetails);
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
});

module.exports = router;