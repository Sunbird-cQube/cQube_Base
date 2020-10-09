const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- semester_completion school wise api ---');
        var sem = req.body.sem;
        let fileName = `exception_list/semester_completion/school_sem_completion_${sem}.json`;
        var schoolData = await s3File.readS3File(fileName);
        var sortedData = schoolData['data'].sort((a, b) => (a.school_name) > (b.school_name) ? 1 : -1)
        logger.info('--- semester_completion school wise api response sent---');
        res.status(200).send({ data: sortedData, footer: schoolData.allSchoolsFooter.total_schools_with_missing_data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('--- semester_completion schoolPerCluster api ---');
        var sem = req.body.sem;
        let fileName = `exception_list/semester_completion/school_sem_completion_${sem}.json`;
        var schoolData = await s3File.readS3File(fileName);

        let distId = req.params.distId;
        let blockId = req.params.blockId;
        let clusterId = req.params.clusterId;

        let filterData = schoolData.data.filter(obj => {
            return (obj.district_id == distId && obj.block_id == blockId && parseInt(obj.cluster_id) == clusterId)
        })

        var sortedData = filterData.sort((a, b) => (a.school_name) > (b.school_name) ? 1 : -1)
        logger.info('--- semester_completion schoolPerCluster api response sent---');
        res.status(200).send({ data: sortedData, footer: schoolData.footer[`${clusterId}`].total_schools_with_missing_data });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;