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
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                var studentCount = 0;
                var schoolData = [];
                JSON.parse(data.Body.toString()).map(item => {
                    studentCount = studentCount + Number(item['students_count']);
                    var obj = {
                        id: item['x_axis'],
                        cluster: item['cluster_name'],
                        clusterId: item['cluster_id'],
                        dist: item['district_name'],
                        block: item['block_name'],
                        name: item['school_name'],
                        label: item['x_value'],
                        lat: item['y_value'],
                        lng: item['z_value'],
                        stdCount: (item['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                    }
                    schoolData.push(obj);
                });
                logger.info('--- Attendance school wise api response sent ---');
                res.status(200).send({ schoolData: schoolData, studentCount: studentCount });
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
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
        if (allSchools.data['errMsg']) {
            res.status(500).json({ errMsg: "Something went wrong" });
        } else {
            var studentCount = 0;
            var schoolsDetails = [];
            allSchools.data.schoolData.map(schools => {
                if (clusterId === schools.clusterId) {
                    studentCount = studentCount + Number(schools.stdCount.replace(/\,/g, ''));
                    obj = {
                        id: schools['id'],
                        name: schools['name'],
                        block: schools['block'],
                        dist: schools['dist'],
                        cluster: schools['cluster'],
                        label: schools['label'],
                        lat: schools['lat'],
                        lng: schools['lng'],
                        stdCount: schools['stdCount']
                    }
                    schoolsDetails.push(obj);
                }
            });
            logger.info('--- Attendance schoolPerCluster api response sent ---');
            res.status(200).send({ schoolsDetails: schoolsDetails, studentCount: studentCount });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }

});

module.exports = router;