const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const helper = require('./helper');

router.post('/clusterWise',auth.authController, async (req, res) => {
    try {
        logger.info('---diksha tpd  cluster wise api ---');
        let { timePeriod, reportType, blockId } = req.body
        var fileName = `diksha_tpd/cluster/${timePeriod}.json`;
        var data = await s3File.readS3File(fileName);

        if (blockId) {
            data = data.filter(val => {
                return (
                    val.block_id == blockId
                )
            })
        }

        let clusterDetails = data.map(e => {
            return {
                district_id: e.district_id,
                district_name: e.district_name,
                block_id: e.block_id,
                block_name: e.block_name,
                cluster_id: e.cluster_id,
                cluster_name: e.cluster_name
            }
        })

        clusterDetails = clusterDetails.reduce((unique, o) => {
            if (!unique.some(obj => obj.cluster_id === o.cluster_id)) {
                unique.push(o);
            }
            return unique;
        }, []);

        data = data.sort((a, b) => (a.cluster_name) > (b.cluster_name) ? 1 : -1)
        let result = await helper.generalFun(data, 2, reportType)

        logger.info('--- diksha tpd  cluster wise response sent ---');
        res.status(200).send({ clusterDetails, result, downloadData: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router