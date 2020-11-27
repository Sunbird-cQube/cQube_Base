const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/blockData',auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha chart allData api ---');
        let timePeriod = req.body.timePeriod;
        let districtId = req.body.districtId;
        var fileName = `diksha_tpd/report2/${timePeriod}/block/all_collections/${districtId}.json`;
        var blockData = await s3File.readS3File(fileName);
        var footer = blockData['footer'][`${districtId}`];
        blockData = blockData.data.filter(a => {
            return a.district_id == districtId;
        });
        var chartData = {
            labels: '',
            data: ''
        }
        
        blockData = blockData.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1);
        chartData['labels'] = blockData.map(a => {
            return a.block_name
        })
        chartData['data'] = blockData.map(a => {
            return { enrollment: a.total_enrolled, completion: a.total_completed, percent_teachers: a.percentage_teachers, percent_completion: a.percentage_completion }
        })
        logger.info('--- diksha chart allData api response sent ---');
        res.send({ chartData, downloadData: blockData, footer });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;