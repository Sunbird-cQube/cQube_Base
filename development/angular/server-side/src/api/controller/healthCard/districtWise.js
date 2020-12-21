const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        var districtId = req.body.id;
        logger.info('---healthCard dist wise api ---');
        let fileName = `healthCard/district/${districtId}.json`;
        var districtData = await s3File.readS3File(fileName);
        logger.info('--- healthCard dist wise api response sent ---');
        res.status(200).send({ districtData });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;