const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');

router.post('/', async (req, res) => {
    try {
        logger.info('--- uploadTelemetry api ---');
        let year = req.body.date.year
        let month = req.body.date.month
        let date = req.body.date.date
        try {
            const_data['getParams']['Key'] = `telemetry/telemetry_${year}_${month}_${date}.json`;
            const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
                if (err) {
                    const_data['s3'].putObject(const_data['getParams'], function (perr, pres) {
                        if (perr) {
                            logger.error("Error uploading data: ", perr);
                        } else {
                            logger.info("Successfully uploaded file");
                            res.send("Successfully uploaded file")
                        }
                    });
                } else if (!data) {
                    logger.error("No data found in s3 file");
                    res.status(403).json({ errMsg: "No such data found" });
                } else {
                    var finalData = JSON.parse(data.Body.toString()).concat(req.body.telemetryData);
                    console.log(finalData);
                    var params = {
                        Bucket: const_data['getParams']['Bucket'],
                        Key: `telemetry/telemetry_${year}_${month}_${date}.json`,
                        Body: JSON.stringify(finalData)
                    };
                    // const_data['s3'].deleteObject(params, function (err, data) {
                    //     if (err) console.log(err, err.stack);  // error
                    //     else console.log();                 // deleted
                    // });
                    const_data['s3'].upload(params, function (error, data) {
                        if (error) {
                            logger.error('ERROR MSG: ', error);
                        } else {
                            logger.info('Telemetry updated successfully')
                            logger.info('--- uploadTelemetry api response sent ---')
                            res.status(200).json({ msg: "Data updated successfully" });
                        }
                    });
                }
            })
        } catch (headErr) {
            if (headErr.code === 'NotFound') {
                const_data['s3'].putObject(const_data['getParams'], function (perr, pres) {
                    if (perr) {
                        logger.error("Error uploading data: ", perr);
                    } else {
                        logger.info("Successfully uploaded file");
                        res.send("Successfully uploaded file")
                    }
                });
            }
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router