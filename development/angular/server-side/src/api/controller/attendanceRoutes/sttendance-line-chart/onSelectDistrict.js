const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/stateWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Trends state wise api ---');
        var year = req.body.year;
        let fileName = `attendance/trend_line_chart/state.json`;
        var stateData = await s3File.readS3File(fileName);
        var mydata = [];

        if (stateData[year]) {
            stateData[year].map(data => {
                var attendanceTest = [
                    {
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
                    },
                ]
                attendanceTest.map(item => {
                    if (item.monthId == data.month) {
                        item.attendance = data.attendance_percentage;
                    }
                })
                let obj2 = {
                    attendance: attendanceTest
                }
                mydata.push(obj2);
            });

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

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Trends dist wise api ---');
        var year = req.body.year;
        let fileName = `attendance/trend_line_chart/district_${year}.json`;
        var districtData = await s3File.readS3File(fileName);
        var keys = Object.keys(districtData);
        var mydata = [];

        keys.map(key => {
            var attendanceTest = [
                {
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
                },
            ]
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

module.exports = router;