const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allSchoolWise', async (req, res) => {
    try {
        logger.info('---Infra all school wise api ---');
        let fileName = `infra/infra_school_table.json`
        var data = await s3File.readS3File(fileName);

        logger.info('---Infra all school wise response sent---');
        res.status(200).send(data);

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra school per cluster api ---');
        var distId = req.params.distId;
        var blockId = req.params.blockId;
        var clusterId = req.params.clusterId;
        let fileName = `infra/infra_school_table.json`
        var schoolData = await s3File.readS3File(fileName);

        let schoolFilterData = schoolData.filter(obj => {
            return (obj.district.id == distId && obj.block.id == blockId && obj.cluster.id == clusterId)
        });
        if (schoolFilterData.length == 0) {
            res.status(404).json({ errMsg: "No data found" });
        } else {
            logger.info('---Infra school per cluster response sent---');
            res.status(200).send(schoolFilterData);
        }

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;