const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra cluster wise api ---');
        let fileName = `infra/infra_cluster_map.json`;
        var clusterData = await s3File.readS3File(fileName);
        var mydata = clusterData.data;
        logger.info('---Infra cluster wise api response sent---');
        res.status(200).send({ data: mydata, footer: clusterData.allClustersFooter.totalSchools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra clusterperBlock api ---');
        let fileName = `infra/infra_cluster_map.json`;
        var clusterData = await s3File.readS3File(fileName);

        let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.details.district_id == distId && obj.details.block_id == blockId)
        })
        let mydata = filterData;
        logger.info('---Infra clusterperBlock api response sent---');
        res.status(200).send({ data: mydata, footer: clusterData.footer[`${blockId}`].totalSchools });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;