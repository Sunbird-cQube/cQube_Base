const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra all cluster wise api ---');
        var management = req.body.management;
        var category = req.body.category;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            fileName = `infra/school_management_category/overall_category/${management}/infra_cluster_table.json`;
        } else {
            fileName = `infra/infra_cluster_table.json`
        }
        var data = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;

        logger.info('---Infra all cluster wise response sent---');
        res.status(200).send(data);

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra cluster per block api ---');
        var blockId = req.params.blockId;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            fileName = `infra/school_management_category/overall_category/${management}/infra_cluster_table.json`;
        } else {
            fileName = `infra/infra_cluster_table.json`
        }
        var clusterData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;

        let clusterFilterData = clusterData.filter(obj => {
            return (obj.block.id == blockId)
        });

        if (clusterFilterData.length == 0) {
            res.status(404).json({ errMsg: "No data found" });
        } else {
            logger.info('---Infra cluster per block response sent---');
            res.status(200).send(clusterFilterData);
        }

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;