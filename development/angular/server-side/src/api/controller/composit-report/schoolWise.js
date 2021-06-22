const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/schoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('---composite report all school wise api ---');
        var management = req.body.management;
        var category = req.body.category;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            fileName = `composite/school_management_category/overall_category/${management}/comp_school.json`
        } else {
            fileName = `composite/comp_school.json`
        }
        var data = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;

        logger.info('---composite report all school wise response sent---');
        res.status(200).send(data);

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('---composite report schools per cluster api ---');
        var distId = req.params.distId;
        var blockId = req.params.blockId;
        var clusterId = req.params.clusterId;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            fileName = `composite/school_management_category/overall_category/${management}/comp_school.json`
        } else {
            fileName = `composite/comp_school.json`
        }
        var schoolData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;

        let schoolFilterData = schoolData.filter(obj => {
            return (obj.district.id == distId && obj.block.id == blockId && obj.cluster.id == clusterId)
        });
        if (schoolFilterData.length == 0) {
            res.status(404).json({ errMsg: "No data found" });
        } else {
            logger.info('---composite report all schools per cluster response sent---');
            res.status(200).send(schoolFilterData);
        }

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;