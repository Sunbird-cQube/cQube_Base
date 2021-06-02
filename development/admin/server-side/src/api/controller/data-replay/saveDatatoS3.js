const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');

router.post('/', auth.authController, async (req, res) => {
    try {
        logger.info('--- telemetry api ---');
        //check if file is there, and append new data
        var formData = req.body.formData;
        var timeStamp = req.body.timeStamp;
        var fileName = `data_replay/data_replay_${timeStamp}.json`;
        if(req.body.dataType == 'retention'){
            formData = req.body.retData;
            fileName = `data_retention/data_retention.json`;
        }
        var params = {
            Bucket: const_data['getParams1']['Bucket'],
            Key: fileName
        };
        const_data['s3'].headObject(params, function (err, metadata) {
            if (err && err.code === 'NotFound') {
                //=====================Upload new files..........
                var params1 = {
                    Bucket: const_data['getParams1']['Bucket'],
                    Key: fileName,
                    Body: JSON.stringify(formData)
                };
                const_data['s3'].upload(params1, function (error, result) {
                    if (error) {
                        res.status(500).json({ errMsg: "Internal error" });
                    } else {
                        logger.info('--- upload new file successful---');
                        res.status(200).json({ msg: "Data Replay Operation Successfully Initiated" });
                    }
                });
            } else {
                const_data['s3'].getSignedUrl('getObject', params, (erro, response) => {
                    const_data['getParams1']['Key'] = fileName;
                    const_data['s3'].getObject(const_data['getParams1'], function (error, data) {
                        if (error) {
                            logger.error(error);
                            res.status(500).json({ errMsg: "Something went wrong" });
                        } else if (!data) {
                            logger.error("No data found in s3 file");
                            res.status(403).json({ errMsg: "No such data found" });
                        } else {
                            let dataObj = formData;
                            params1 = {
                                Bucket: const_data['getParams1']['Bucket'],
                                Key: fileName,
                                Body: JSON.stringify(dataObj)
                            };
                            const_data['s3'].upload(params1, function (e, result) {
                                if (e) {
                                    res.status(500).json({ errMsg: "Internal error" });
                                } else {
                                    logger.info('--- update to file successful---');
                                    res.status(200).json({ msg: "Data Replay Operation Successfully Initiated" });
                                }
                            });
                        }
                    });
                });
            }
        });

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router