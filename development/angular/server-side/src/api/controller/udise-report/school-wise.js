const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('---UDISE school wise api ---');
        var management = req.body.management;
        var category = req.body.category;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            fileName = `udise/school_management_category/overall_category/${management}/school.json`;
        } else {
            fileName = `udise/udise_school_wise.json`
        }
        var schoolData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var mydata = schoolData.data;
        logger.info('---UDISE school wise api response sent---');
        res.status(200).send({ data: mydata, footer: schoolData.allSchoolsFooter.totalSchools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('---UDISE schoolPerCluster api ---');
        var management = req.body.management;
        var category = req.body.category;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            fileName = `udise/school_management_category/overall_category/${management}/school.json`;
        } else {
            fileName = `udise/udise_school_wise.json`
        }
        var schoolData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        let clusterId = req.params.clusterId;

        let filterData = schoolData.data.filter(obj => {
            return (obj.details.cluster_id == clusterId)
        })
        let mydata = filterData;
        logger.info('---UDISE schoolPerCluster api response sent---');
        res.status(200).send({ data: mydata, footer: schoolData.footer[`${clusterId}`].totalSchools });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;