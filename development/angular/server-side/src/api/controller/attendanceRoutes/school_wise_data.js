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
                var myData = JSON.parse(data.Body.toString());
                for (let i = 0; i < myData.length; i++) {
                    studentCount = studentCount + Number(myData[i]['students_count']);
                    var obj = {
                        id: myData[i]['x_axis'],
                        cluster: myData[i]['cluster_name'],
                        clusterId: myData[i]['cluster_id'],
                        dist: myData[i]['district_name'],
                        block: myData[i]['block_name'],
                        name: myData[i]['school_name'],
                        label: myData[i]['x_value'],
                        lat: myData[i]['y_value'],
                        lng: myData[i]['z_value'],
                        stdCount: (myData[i]['students_count']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                    }
                    schoolData.push(obj);
                };
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
            var filterData = allSchools.data.schoolData.filter(data => {
                return (data.clusterId == clusterId)
            });
            var myData = filterData;
            for (let i = 0; i < myData.length; i++) {
                studentCount = studentCount + Number(myData[i].stdCount.replace(/\,/g, ''));
                var obj = {
                    id: myData[i]['id'],
                    name: myData[i]['name'],
                    block: myData[i]['block'],
                    dist: myData[i]['dist'],
                    cluster: myData[i]['cluster'],
                    label: myData[i]['label'],
                    lat: myData[i]['lat'],
                    lng: myData[i]['lng'],
                    stdCount: myData[i]['stdCount']
                }
                schoolsDetails.push(obj);
            };
            logger.info('--- Attendance schoolPerCluster api response sent ---');
            res.status(200).send({ schoolsDetails: schoolsDetails, studentCount: studentCount });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }

});

module.exports = router;