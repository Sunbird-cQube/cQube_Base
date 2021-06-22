const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');
var const_data = require('../../lib/config');

router.post('/districtWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc all district wise api ---');
        var timePeriod = req.body.timePeriod;
        var year = req.body.year;
        var month = req.body.month;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category == 'overall') {
            if (timePeriod && timePeriod != 'select_month') {
                fileName = `crc/school_management_category/${timePeriod}/overall_category/${management}/district.json`;
            } else {
                fileName = `crc/school_management_category/${year}/${month}/overall_category/${management}/district.json`;
            }
        } else {
            if (timePeriod && timePeriod != 'select_month') {
                fileName = `crc/${timePeriod}/district.json`;
            } else {
                fileName = `crc/${year}/${month}/district.json`;
            }
        }

        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
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


router.get('/getDateRange', auth.authController, function (req, res) {
    try {
        logger.info('---getDateRange api ---');
        const_data['getParams']['Key'] = `crc/crc_meta_year_month.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let dateObj = data.Body.toString();
                logger.info('--- getDateRange response sent ---');
                res.status(200).send(dateObj);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});
module.exports = router;