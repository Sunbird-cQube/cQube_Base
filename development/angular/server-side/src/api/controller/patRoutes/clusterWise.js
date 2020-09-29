const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT cluster wise api ---');
        let fileName;
        var clusterData = {}
        if (req.body.data) {
            fileName = `pat/cluster/${req.body.data}.json`;
            clusterData = await s3File.readS3File(fileName);
        } else {
            fileName = `pat/pat_cluster.json`
            clusterData = await s3File.readS3File(fileName);
        }
        var mydata = clusterData.data;
        logger.info('---PAT cluster wise api response sent---');
        res.status(200).send({ data: mydata, footer: clusterData.AllClustersFooter });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT clusterperBlock api ---');
        let fileName = `pat/pat_cluster.json`;
        var clusterData = await s3File.readS3File(fileName);

        let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.Details.district_id == distId && obj.Details.block_id == blockId)
        })
        let mydata = filterData;
        logger.info('---PAT clusterperBlock api response sent---');
        res.status(200).send({ data: mydata, footer: clusterData.footer[`${blockId}`] });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;