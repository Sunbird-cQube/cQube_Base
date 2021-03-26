const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const groupArray = require('group-array');

router.post('/stateWise', auth.authController, async(req, res) => {
    try {
        logger.info('---Trends state wise api ---');
        var year = req.body.year;
        let fileName = `attendance/trend_line_chart/state_${year}.json`;
        var stateData = await s3File.readS3File(fileName);
        var mydata = [];

        if (stateData[year]) {
            var attendanceTest = [{
                monthId: 6,
                month: 'June',
                attendance: ''
            }, {
                monthId: 7,
                month: 'July',
                attendance: ''
            }, {
                monthId: 8,
                month: 'August',
                attendance: ''
            }, {
                monthId: 9,
                month: 'September',
                attendance: ''
            }, {
                monthId: 10,
                month: 'October',
                attendance: ''
            }, {
                monthId: 11,
                month: 'November',
                attendance: ''
            }, {
                monthId: 12,
                month: 'December',
                attendance: ''
            }, {
                monthId: 1,
                month: 'January',
                attendance: ''
            }, {
                monthId: 2,
                month: 'February',
                attendance: ''
            }, {
                monthId: 3,
                month: 'March',
                attendance: ''
            }, {
                monthId: 4,
                month: 'April',
                attendance: ''
            }, {
                monthId: 5,
                month: 'May',
                attendance: ''
            }, ]
            stateData[year].map(data => {
                attendanceTest.map(item => {
                    if (item.monthId == data.month) {
                        item.attendance = data.attendance_percentage;
                    }
                })
            });
            let obj2 = {
                attendance: attendanceTest
            }
            mydata.push(obj2);
            logger.info('--- Trends state wise api response sent ---');
            res.status(200).send({ data: mydata });
        } else {
            res.status(403).send({ errMsg: "Something went wrong" });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/distWise', auth.authController, async(req, res) => {
    try {
        logger.info('---Trends dist wise api ---');
        var year = req.body.year;
        let fileName = `attendance/trend_line_chart/district/district_${year}.json`;
        console.log(fileName);
        var districtData = await s3File.readS3File(fileName);
        var keys = Object.keys(districtData);
        var mydata = [];

        keys.map(key => {
            var attendanceTest = [{
                monthId: 6,
                month: 'June',
                attendance: ''
            }, {
                monthId: 7,
                month: 'July',
                attendance: ''
            }, {
                monthId: 8,
                month: 'August',
                attendance: ''
            }, {
                monthId: 9,
                month: 'September',
                attendance: ''
            }, {
                monthId: 10,
                month: 'October',
                attendance: ''
            }, {
                monthId: 11,
                month: 'November',
                attendance: ''
            }, {
                monthId: 12,
                month: 'December',
                attendance: ''
            }, {
                monthId: 1,
                month: 'January',
                attendance: ''
            }, {
                monthId: 2,
                month: 'February',
                attendance: ''
            }, {
                monthId: 3,
                month: 'March',
                attendance: ''
            }, {
                monthId: 4,
                month: 'April',
                attendance: ''
            }, {
                monthId: 5,
                month: 'May',
                attendance: ''
            }, ]
            districtData[key].attendance.map(a => {
                attendanceTest.map(item => {
                    if (item.monthId == a.month) {
                        item.attendance = a.attendance_percentage;
                    }
                })
            });
            let obj2 = {
                districtId: key,
                districtName: districtData[key].district_name[0],
                attendance: attendanceTest
            }
            mydata.push(obj2);
        });
        logger.info('--- Trends dist wise api response sent ---');
        res.status(200).send({ data: mydata });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});


router.get('/getDateRange', auth.authController, function(req, res) {
    try {
        logger.info('---getDateRange api ---');
        const_data['getParams']['Key'] = `attendance/student_attendance_meta.json`;
        const_data['s3'].getObject(const_data['getParams'], function(err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let dateObj = data.Body.toString();
                dateObj = JSON.parse(dateObj);
                let date = groupArray(dateObj, 'year')
                logger.info('--- getDateRange response sent ---');
                res.status(200).send(date);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;