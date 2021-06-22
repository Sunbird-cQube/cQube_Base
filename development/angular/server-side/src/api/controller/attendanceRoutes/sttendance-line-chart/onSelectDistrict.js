const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const groupArray = require('group-array');

router.post('/stateWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Trends state wise api ---');
        var year = req.body.year;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category == 'overall') {
            fileName = `attendance/trend_line_chart/school_management_category/overall_category/overall/${management}/state_${year}.json`;
        } else {
            fileName = `attendance/trend_line_chart/state_${year}.json`;
        }
        var stateData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var mydata = [];

        if (stateData[year]) {
            var attendanceTest = [{
                monthId: 6,
                month: 'June',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 7,
                month: 'July',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 8,
                month: 'August',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 9,
                month: 'September',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 10,
                month: 'October',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 11,
                month: 'November',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 12,
                month: 'December',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 1,
                month: 'January',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 2,
                month: 'February',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 3,
                month: 'March',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 4,
                month: 'April',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 5,
                month: 'May',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }]
            stateData[year].map(data => {
                attendanceTest.map(item => {
                    if (item.monthId == data.month) {
                        item.attendance = data.attendance_percentage;
                        item.year = data.year;
                        item.studentCount = data.students_count;
                        item.schoolCount = data.total_schools;
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

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Trends dist wise api ---');
        var year = req.body.year;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category == 'overall') {
            fileName = `attendance/trend_line_chart/school_management_category/overall_category/overall/${management}/district/district_${year}.json`;
        } else {
            fileName = `attendance/trend_line_chart/district/district_${year}.json`;
        }

        var districtData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var keys = Object.keys(districtData);
        var mydata = [];

        keys.map(key => {
            var attendanceTest = [{
                monthId: 6,
                month: 'June',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 7,
                month: 'July',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 8,
                month: 'August',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 9,
                month: 'September',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 10,
                month: 'October',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 11,
                month: 'November',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 12,
                month: 'December',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 1,
                month: 'January',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 2,
                month: 'February',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 3,
                month: 'March',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 4,
                month: 'April',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }, {
                monthId: 5,
                month: 'May',
                year: undefined,
                studentCount: undefined,
                schoolCount: undefined,
                attendance: ''
            }]
            districtData[key].attendance.map(a => {
                attendanceTest.map(item => {
                    if (item.monthId == a.month) {
                        item.attendance = a.attendance_percentage;
                        item.year = a.year;
                        item.studentCount = a.students_count;
                        item.schoolCount = a.total_schools;
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


router.get('/getDateRange', auth.authController, function (req, res) {
    try {
        logger.info('---getDateRange api ---');
        const_data['getParams']['Key'] = `attendance/student_attendance_meta.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
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