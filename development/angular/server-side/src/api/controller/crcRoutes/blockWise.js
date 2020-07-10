const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');


router.post('/allBlockWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc all block wise api ---');
        let fileName = `crc/block_crc_opt_json.json`;
        var jsonData = await s3File.readS3File(fileName);

        var blockData = jsonData.data;
        logger.info('--- crc all blocks api response sent ---');
        res.status(200).send({ visits: blockData });

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/blockWise/:distId', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc block per district api ---');

        let distId = req.params.distId;
        let fileName = `crc/block_crc_opt_json.json`;
        var jsonData = await s3File.readS3File(fileName);

        var blockData = jsonData
        let filterData = jsonData.data.filter(obj => {
            return (obj.districtId == distId);
        });
        if (filterData.length > 0) {
            logger.info('--- crc block per district api response sent ---');
            res.status(200).send({ visits: filterData, schoolsVisitedCount: blockData.footer[`${distId}`] });
        } else {
            res.status(403).json({ errMsg: "No matches found" });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;