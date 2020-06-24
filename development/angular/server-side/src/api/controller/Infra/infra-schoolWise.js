const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

router.post('/allSchoolWise', auth.authController, function (req, res) {
    try {
        logger.info('---Infra all school wise api ---');
        // var month = req.body.month;
        // var year = req.body.year;
        const_data['getParams']['Key'] = `infra/infra_school.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                logger.info('---Infra all school wise response sent---');
                res.status(200).send(data.Body);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, function (req, res) {
    try {
        logger.info('---Infra school wise api ---');
        var distId = req.params.distId;
        var blockId = req.params.blockId;
        var clusterId = req.params.clusterId;
        const_data['getParams']['Key'] = `infra/infra_school.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                logger.info('---Infra school wise response sent---');
                let schoolData = data.Body.toString();
                schoolData = JSON.parse(schoolData)

                let schoolFilterData = schoolData.filter(obj => {
                    return (obj.district.id == distId && obj.block.id == blockId && obj.cluster.id == clusterId)
                });
                if (schoolFilterData.length == 0) {
                    res.status(404).json({ errMsg: "No data found" });
                } else {
                    res.status(200).send(schoolFilterData);
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;