const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        var districtId = req.body.id;
        logger.info('---healthCard dist wise api ---');
        var timePeriod = req.body.timePeriod;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            fileName = `healthCard/school_management_category/${timePeriod}/overall_category/${management}/district/${districtId}.json`;
        } else {
            fileName = `healthCard/district/${timePeriod}/${districtId}.json`;
        }

        var districtData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        logger.info('--- healthCard dist wise api response sent ---');
        res.status(200).send({ districtData });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;