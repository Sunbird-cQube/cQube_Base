const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.get('/school_invalid_data', auth.authController, async (req, res) => {
    try {
        logger.info('--- school invalid data api ---');
        let fileName = `exception_list/school_invalid_data.json`
        var data = await s3File.readS3File(fileName);
        logger.info('--- school invalid data api response sent ---');
        res.status(200).send(data)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;