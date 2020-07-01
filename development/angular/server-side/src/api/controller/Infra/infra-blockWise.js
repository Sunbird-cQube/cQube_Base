const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

router.post('/blockWise', auth.authController, function (req, res) {
    try {
        logger.info('---Infra block wise api ---');
        const_data['getParams']['Key'] = `infra/infra_block.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                logger.info('--- Infra dist block api response sent ---');
                res.status(200).send(data.Body);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/blockWise/:distId', auth.authController, function (req, res) {
    try {
        logger.info('---Infra block wise api ---');
        const_data['getParams']['Key'] = `infra/infra_block.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let blockData = data.Body.toString();
                blockData = JSON.parse(blockData);

                let distId = req.params.distId

                let filterData = blockData.filter(obj => {
                    return (obj.district.id == distId)
                });
                if (filterData.length == 0) {
                    res.status(404).json({ errMsg: "No data found" });
                } else {

                    // map and extract required  values to show in the leaflet-map
                    logger.info('--- semester block wise api reponse sent ---');
                    res.status(200).send(filterData);
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;