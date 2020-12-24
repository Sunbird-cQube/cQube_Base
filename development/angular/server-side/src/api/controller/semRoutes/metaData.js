const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/metadata', async (req, res) => {
    try {
        logger.info('---sem metadata api ---');
        let fileName = `semester/metaData.json`
        var data = await s3File.readS3File(fileName);

        logger.info('--- sem metadata api response sent ---');
        res.status(200).send({ data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;