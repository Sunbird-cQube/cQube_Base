const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---UDISE dist wise api ---');
        let fileName = `udise/udise_district_wise.json`
        var districtData = await s3File.readS3File(fileName);
        var mydata = districtData.data;

        logger.info('--- UDISE dist wise api response sent ---');
        res.status(200).send({ data: mydata, footer: districtData.allDistrictsFooter.totalSchools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;