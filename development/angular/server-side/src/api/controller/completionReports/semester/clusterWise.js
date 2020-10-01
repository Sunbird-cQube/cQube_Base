const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allClusterWise',auth.authController, async (req, res) => {
    try {
        logger.info('--- semester_completion cluster wise api ---');
        var sem = req.body.sem;
        let fileName = `exception_list/semester_completion/cluster_sem_completion_${sem}.json`;
        var clusterData = await s3File.readS3File(fileName);
        var sortedData = clusterData['data'].sort((a, b) => (a.cluster_name) > (b.cluster_name) ? 1 : -1)
        logger.info('--- semester_completion cluster wise api response sent---');
        res.status(200).send({ data: sortedData, footer: clusterData.allClustersFooter.total_schools_with_missing_data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId',auth.authController, async (req, res) => {
    try {
        logger.info('---semester_completion clusterperBlock api ---');
        var sem = req.body.sem;
        let fileName = `exception_list/semester_completion/cluster_sem_completion_${sem}.json`;
        var clusterData = await s3File.readS3File(fileName);

        let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.district_id == distId && obj.block_id == blockId)
        })
        var sortedData = filterData.sort((a, b) => (a.cluster_name) > (b.cluster_name) ? 1 : -1)
        logger.info('---semester_completion clusterperBlock api response sent---');
        res.status(200).send({ data: sortedData, footer: clusterData.footer[`${blockId}`].total_schools_with_missing_data });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;