const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const axios = require('axios');
const auth = require('../../middleware/check-auth');

router.post('/schoolWise', auth.authController, function (req, res) {
    try {
        logger.info('--- Attendance school wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        const_data['getParams']['Key'] = `attendance/school_attendance_${year}_${month}.json`;
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.send([]);
            } else if (!data) {
                logger.info("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                logger.info('--- Attendance school wise api response sent ---');
                res.send(data.Body);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
});

router.post('/schoolPerCluster', auth.authController, async (req, res) => {
    try {
        logger.info('--- Attendance schoolPerCluster api ---');

        var clusterId = req.body.data.id;
        var baseUrl = req.body.baseUrl;
        var token = req.headers.token;
        var month = req.body.data.month;
        var year = req.body.data.year;

        var allSchools = await axios.post(`${baseUrl}/attendance/schoolWise`, { month: month, year: year }, { 'headers': { 'token': "Bearer" + token } });

        var schoolsDetails = [];
        allSchools.data.forEach(schools => {
            if (clusterId === schools.cluster_id) {
                obj = {
                    x_axis: schools.x_axis,
                    cluster: schools.cluster_name,
                    distName: schools.district_name,
                    blockName: schools.block_name,
                    schoolName: schools.school_name,
                    x_value: schools.x_value,
                    y_value: schools.y_value,
                    z_value: schools.z_value,
                    students_count: schools.students_count,
                }
                schoolsDetails.push(obj);
            }
        });
        logger.info('--- Attendance schoolPerCluster api response sent ---');
        res.send(schoolsDetails);
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }

});

module.exports = router;