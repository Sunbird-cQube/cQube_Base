const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allDistrictWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- pat exception district api ---');
        var timePeriod = req.body.timePeriod;
        let fileName = `exception_list/pat_exception/${timePeriod}/district.json`;
        var districtData = await s3File.readS3File(fileName);
        var sortedData = districtData['data'].sort((a, b) => (a.district_name) > (b.district_name) ? 1 : -1);
        logger.info('--- pat exception district api response sent ---');
        res.status(200).send({ data: sortedData, footer: districtData.allDistrictsFooter.total_schools_with_missing_data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router