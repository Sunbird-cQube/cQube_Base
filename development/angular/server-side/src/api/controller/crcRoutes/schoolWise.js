const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc all school wise api ---');

        var timePeriod = req.body.timePeriod;
        var year = req.body.year;
        var month = req.body.month
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category == 'overall') {
            if (timePeriod && timePeriod != 'select_month') {
                fileName = `crc/school_management_category/${timePeriod}/overall_category/${management}/school.json`;
            } else {
                fileName = `crc/school_management_category/${year}/${month}/overall_category/${management}/school.json`;
            }
        } else {
            if (timePeriod && timePeriod != 'select_month') {
                fileName = `crc/${timePeriod}/school.json`;
            } else {
                fileName = `crc/${year}/${month}/school.json`;
            }
        }
        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;

        var schoolData = jsonData.data;
        logger.info('--- crc all school wise api response sent ---');
        res.status(200).send({ visits: schoolData });

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc school per cluster api ---');
        var timePeriod = req.body.timePeriod;
        var year = req.body.year;
        var month = req.body.month
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category == 'overall') {
            if (timePeriod && timePeriod != 'select_month') {
                fileName = `crc/school_management_category/${timePeriod}/overall_category/${management}/school.json`;
            } else {
                fileName = `crc/school_management_category/${year}/${month}/overall_category/${management}/school.json`;
            }
        } else {
            if (timePeriod && timePeriod != 'select_month') {
                fileName = `crc/${timePeriod}/school.json`;
            } else {
                fileName = `crc/${year}/${month}/school.json`;
            }
        }
        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;

        var schoolData = jsonData
        let clusterId = req.params.clusterId;

        let filterData = schoolData.data.filter(obj => {
            return (obj.clusterId == clusterId);
        });
        if (filterData.length > 0) {
            logger.info('--- crc school per cluster api response sent ---');
            res.status(200).send({ visits: filterData, schoolsVisitedCount: schoolData.footer[`${clusterId}`] });
        } else {
            res.status(403).json({ errMsg: "No matches found" });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;