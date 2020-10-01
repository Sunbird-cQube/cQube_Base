const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allDistrictWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- semester_completion district api ---');
        var sem = req.body.sem;
        let fileName = `exception_list/semester_completion/district_sem_completion_${sem}.json`
        var districtData = await s3File.readS3File(fileName);
        var sortedData = districtData['data'].sort((a, b) => (a.district_name) > (b.district_name) ? 1 : -1)
        logger.info('--- semester_completion district api response sent ---');
        res.status(200).send({ data: sortedData, footer: districtData.allDistrictsFooter.total_schools_with_missing_data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router