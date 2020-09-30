const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc all school wise api ---');

        let fileName = `crc/school_crc_opt_json.json`;
        var jsonData = await s3File.readS3File(fileName);

        var schoolData = jsonData.data;
        logger.info('--- crc all school wise api response sent ---');
        res.status(200).send({ visits: schoolData });

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc school per cluster api ---');
        let fileName = `crc/school_crc_opt_json.json`;
        var jsonData = await s3File.readS3File(fileName);

        var schoolData = jsonData

        let distId = req.params.distId;
        let blockId = req.params.blockId;
        let clusterId = req.params.clusterId;

        let filterData = schoolData.data.filter(obj => {
            return (obj.districtId == distId && obj.blockId == blockId && obj.clusterId == clusterId);
        });
        if (filterData.length > 0) {
            logger.info('--- crc school per cluster api response sent ---');
            res.status(200).send({ visits: filterData, schoolsVisitedCount: schoolData.footer[`${clusterId}`] });
        } else {
            res.status(403).json({ errMsg: "No matches found" });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;