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
                res.send([]);
            } else if (!data) {
                logger.info("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                logger.info('--- Attendance block wise api response sent ---');
                res.send(data.Body);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/blockPerDist', auth.authController, async (req, res) => {
    try{
        logger.info('---Attendance blockPerDist api ---');
        var distId = req.body.data.id;
        var baseUrl = req.body.baseUrl;
        var token = req.headers.token;
        var month = req.body.data.month;
        var year = req.body.data.year;
        var allBlocks = await axios.post(`${baseUrl}/attendance/blockWise`, { month: month, year: year }, { 'headers': { 'token': "Bearer" + token } });
    
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
        res.send(blcokDetails);
    }catch(e){
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
});

module.exports = router;