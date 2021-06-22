const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/schoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Trends dist wise api ---');
        var year = req.body.year;
        var clusterId = req.body.clusterId;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category == 'overall') {
            fileName = `attendance/trend_line_chart/school_management_category/overall_category/overall/${management}/school/${clusterId}_${year}.json`;
        } else {
            fileName = `attendance/trend_line_chart/school/${clusterId}_${year}.json`;
        }
        var schoolData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var keys = Object.keys(schoolData);
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
            schoolData[key].attendance.map(a => {
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
                schoolId: key,
                schoolName: schoolData[key].school_name[0],
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