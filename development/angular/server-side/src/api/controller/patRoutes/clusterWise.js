const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT cluster wise api ---');
        var period = req.body.data.period;
        var grade = req.body.data.grade;
        var fileName;
        var clusterData = {}

        if (period == '') {
            if (grade) {
                fileName = `pat/all/cluster/${grade}.json`;
            } else {
                fileName = `pat/all/pat_cluster.json`;
            }
        } else {
            if (grade) {
                fileName = `pat/${period}/cluster/${grade}.json`;
            } else {
                fileName = `pat/${period}/pat_cluster.json`;
            }
        }

        clusterData = await s3File.readS3File(fileName);
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
        var period = req.body.data.period;
        var fileName;
        if (period == '') {
            fileName = `pat/all/pat_cluster.json`;
        } else {
            fileName = `pat/${period}/pat_cluster.json`;
        }

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