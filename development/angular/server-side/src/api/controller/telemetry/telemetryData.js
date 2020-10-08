const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');
const jsonexport = require('jsonexport');
var S3Append = require('s3-append').S3Append;
var config = require('../../lib/config');
const { format } = require('path');

router.post('/', auth.authController, async (req, res) => {
    try {
        logger.info('--- telemetry api ---');
        let year = req.body.date.year;
        let month = req.body.date.month;
        let date = req.body.date.date;
        let hour = req.body.date.hour;

        //check if file is there, and append new data
        var params = {
            Bucket: const_data['getParams1']['Bucket'],
            Key: `telemetry/telemetry_view/telemetry_views_${year}_${month}_${date}_${hour}.csv`
        };
        const_data['s3'].headObject(params, function (err, metadata) {
            if (err && err.code === 'NotFound') {
                //=====================Upload new files..........
                jsonexport(req.body.telemetryData, function (error, csv) {
                    if (error) return console.error(error);
                    var params1 = {
                        Bucket: const_data['getParams1']['Bucket'],
                        Key: `telemetry/telemetry_view/telemetry_views_${year}_${month}_${date}_${hour}.csv`,
                        Body: csv.replace(/,/g, '|')
                    };
                    const_data['s3'].upload(params1, function (err, result) {
                        if (err) {
                            res.status(500)({ errMsg: "Internal error" });
                        } else {
                            logger.info('--- upload new file successful---');
                            res.status(200).json({ msg: "Successfully uploaded file" });
                        }
                    });
                });
            } else {
                const_data['s3'].getSignedUrl('getObject', params, (error, response) => {

                    jsonexport(req.body.telemetryData, { includeHeaders: false }, function (error, csv) {
                        var service = new S3Append(config.appendConfig, `telemetry/telemetry_view/telemetry_views_${year}_${month}_${date}_${hour}.csv`, format.csv);

                        service.append(`\r${csv.replace(/,/g, '|')}`);

                        service.flush()
                            .then(function () {
                                logger.info('--- appende new data successful---');
                                res.status(200).json({ msg: "new data appended" });
                            })
                            .catch(function (err) {
                                res.status(500)({ errMsg: "Internal error" });
                            });
                    });
                });
            }
        });

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.get('/', (req, res) => {
    // const_data['getParams1']['Key'] = `telemetry/telemetry_view/telemetry_views_2020_10_08_15.csv`;
    // const_data['s3'].getObject(const_data['getParams1'], async function (err, data) {
    //     if (err) {
    //         logger.error(err);
    //         res.status(500).json({ msg: "Something went wrong" });
    //     } else if (!data) {
    //         logger.error("No data found in s3 file");
    //         res.status(403).json({ msg: "No such data found" });
    //     } else {
    var objArr = [
        {
            reportId: "sar",
            views: 225,
            period: "last 24hrs"
        },
        {
            reportId: "sar",
            views: 2225,
            period: "last 7days"
        },
        {
            reportId: "sar",
            views: 22225,
            period: "last 30days"
        }
    ]
    // console.log(data.Body.toString());
    res.send({ objArr });
    //     }
    // });
})

module.exports = router