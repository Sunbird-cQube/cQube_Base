const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/', async (req, res) => {
    try {
        logger.info('---deeksha api ---');
        let fileName = `diksha/diksha.json`;
        var dikshaData = await s3File.readS3File(fileName);

        var mydata = dikshaData;
        logger.info('---deeksha api response sent---');
        res.status(200).send({ data: mydata });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;