const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/districtWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc all district wise api ---');

        let fileName = `crc/district_crc_opt_json.json`;
        var jsonData = await s3File.readS3File(fileName);
        var districtData = jsonData

        districtData.allDistrictsFooter['totalNumberOfVisits'] = parseInt(districtData.allDistrictsFooter.totalNumberOfVisits);
        districtData.allDistrictsFooter['totalNumberOfSchools'] = parseInt(districtData.allDistrictsFooter.totalNumberOfSchools);
        districtData.allDistrictsFooter['totalSchoolsVisited'] = parseInt(districtData.allDistrictsFooter.totalSchoolsVisited);
        districtData.allDistrictsFooter['totalSchoolsNotVisited'] = parseInt(districtData.allDistrictsFooter.totalSchoolsNotVisited);

        logger.info('--- crc all district api response sent ---');
        res.status(200).send({ visits: districtData.data, schoolsVisitedCount: districtData.allDistrictsFooter });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})
module.exports = router;