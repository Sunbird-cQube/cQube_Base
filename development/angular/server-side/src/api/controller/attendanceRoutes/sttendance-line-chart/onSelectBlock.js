const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/blockWise', auth.authController, async(req, res) => {
    try {
        logger.info('---Trends dist wise api ---');
        var year = req.body.year;
        var districtId = req.body.districtId;
        let fileName = `attendance/trend_line_chart/block/${districtId}_${year}.json`;
        var blockData = await s3File.readS3File(fileName);
        var keys = Object.keys(blockData);
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
            blockData[key].attendance.map(a => {
                attendanceTest.map(item => {
                    if (item.monthId == a.month) {
                        item.attendance = a.attendance_percentage;
                    }
                })
            });
            let obj2 = {
                blockId: key,
                blockName: blockData[key].block_name[0],
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