const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

router.post('/allClusterWise',auth.authController, function (req, res) {
    try {
        logger.info('---Infra all cluster wise api ---');
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
                logger.info('---Infra all cluster wise response sent---');
                res.status(200).send(data.Body);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController,function (req, res) {
    try {
        logger.info('---Infra cluster wise api ---');
        var distId = req.params.distId;
        var blockId = req.params.blockId;
        const_data['getParams']['Key'] = `infra/infra_cluster.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                logger.info('---Infra cluster wise response sent---');
                let clusterData = data.Body.toString();
                clusterData = JSON.parse(clusterData)
                
                let clusterFilterData = clusterData.filter(obj => {
                    return (obj.district.id == distId && obj.block.id == blockId)
                })
                res.status(200).send(clusterFilterData);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;