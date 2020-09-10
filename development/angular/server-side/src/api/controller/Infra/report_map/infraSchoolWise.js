const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra school wise api ---');
        let fileName = `infra/infra_school_map.json`;
        var schoolData = await s3File.readS3File(fileName);
        var mydata = schoolData.data;
        logger.info('---Infra school wise api response sent---');
        res.status(200).send({ data: mydata, footer: schoolData.allSchoolsFooter.totalSchools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId',  async (req, res) => {
    try {
        logger.info('---Infra schoolPerCluster api ---');
        let fileName = `infra/infra_school_map.json`;
        var schoolData = await s3File.readS3File(fileName);

        let distId = req.params.distId;
        let blockId = req.params.blockId;
        let clusterId = req.params.clusterId;

        let filterData = schoolData.data.filter(obj => {
            return (obj.details.district_id == distId && obj.details.block_id == blockId && parseInt(obj.details.cluster_id) == clusterId)
        })

        let mydata = filterData;
        logger.info('---Infra schoolPerCluster api response sent---');
        res.status(200).send({ data: mydata, footer: schoolData.footer[`${clusterId}`].totalSchools });

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;