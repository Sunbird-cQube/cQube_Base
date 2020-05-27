const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const groupArray = require('group-array');

// router.get('/getDateRange', function (req, res) {
//     try {
//         logger.info('---getDateRange api ---');
//         // const_data['getParams']['Key'] = `attendance/district_attendance_${year}_${month}.json`;
//         // const_data['s3'].getObject(const_data['getParams'], function (err, data) {
//         //     if (err) {
//         //         logger.error(err);
//         //         res.send([]);
//         //     } else if (!data) {
//         //         logger.info("Something went wrong or s3 file not found");
//         //         res.send([]);
//         //     } else {
//         //         logger.info('--- getDateRange response sent ---');
//         //         res.send(data.Body);
//         //     }
//         // });
//         let dateObj = [
//             {
//                 "total_districts": 33,
//                 "total_blocks": 253,
//                 "total_clusters": 3233,
//                 "total_schools": 51408,
//                 "total_students": 10473327,
//                 "data_from_date": "01-08-2019",
//                 "data_upto_date": "31-08-2019",
//                 "month": 8,
//                 "month_name": "August",
//                 "year": 2019
//             },
//             {
//                 "total_districts": 33,
//                 "total_blocks": 253,
//                 "total_clusters": 3233,
//                 "total_schools": 53175,
//                 "total_students": 11297862,
//                 "data_from_date": "01-09-2019",
//                 "data_upto_date": "30-09-2019",
//                 "month": 9,
//                 "month_name": "September",
//                 "year": 2019
//             },
//             {
//                 "total_districts": 33,
//                 "total_blocks": 253,
//                 "total_clusters": 3233,
//                 "total_schools": 52654,
//                 "total_students": 11094890,
//                 "data_from_date": "01-10-2019",
//                 "data_upto_date": "31-10-2019",
//                 "month": 10,
//                 "month_name": "October",
//                 "year": 2019
//             },
//             {
//                 "total_districts": 33,
//                 "total_blocks": 253,
//                 "total_clusters": 3233,
//                 "total_schools": 52654,
//                 "total_students": 11094890,
//                 "data_from_date": "01-03-2019",
//                 "data_upto_date": "31-03-2019",
//                 "month": 3,
//                 "month_name": "March",
//                 "year": 2020
//             },
//             {
//                 "total_districts": 33,
//                 "total_blocks": 253,
//                 "total_clusters": 3233,
//                 "total_schools": 52654,
//                 "total_students": 11094890,
//                 "data_from_date": "01-04-2019",
//                 "data_upto_date": "31-04-2019",
//                 "month": 4,
//                 "month_name": "April",
//                 "year": 2020
//             }
//         ]

//         let date = groupArray(dateObj, 'year')

//         res.send(date)
//     } catch (e) {
//         logger.error(`Error :: ${e}`)
//         res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
//     }
// });

router.get('/getDateRange', auth.authController, function (req, res) {
    try {
        logger.info('---getDateRange api ---');
        const_data['getParams']['Key'] = `attendance/student_attendance_meta.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.send([]);
            } else if (!data) {
                logger.info("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                let dateObj = data.Body.toString();;
                dateObj = JSON.parse(dateObj);
                let date = groupArray(dateObj, 'year')
                logger.info('--- getDateRange response sent ---');
                res.send(date)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
});

module.exports = router;