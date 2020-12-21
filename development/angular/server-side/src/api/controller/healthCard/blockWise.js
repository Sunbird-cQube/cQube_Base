const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/blockWise', auth.authController, async (req, res) => {
    try {
        var blockId = req.body.id;
        logger.info('---healthCard block wise api ---');
        let fileName = `healthCard/block/${blockId}.json`;
        var blockData = await s3File.readS3File(fileName);
        logger.info('--- healthCard block wise api response sent ---');
        res.status(200).send({ blockData });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;