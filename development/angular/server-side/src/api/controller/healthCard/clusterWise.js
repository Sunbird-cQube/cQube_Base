const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/clusterWise', auth.authController, async (req, res) => {
    try {
        var blockId = req.body.blockId;
        var clusterId = req.body.id;
        logger.info('---healthCard cluster wise api ---');
        let fileName = `healthCard/cluster/${blockId}.json`;
        var clusterData = await s3File.readS3File(fileName);
        clusterData = clusterData.filter(a => {
            if (a.cluster_id == clusterId) {
                return a;
            }
        });
        logger.info('--- healthCard cluster wise api response sent ---');
        if (clusterData.length > 0) {
            res.status(200).send({ clusterData });
        } else {
            res.status(403).json({ errMessage: "Data not available" });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;