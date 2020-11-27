const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/schoolData',auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha chart allData api ---');
        let timePeriod = req.body.timePeriod;
        let blockId = req.body.blockId;
        let clusterId = req.body.clusterId
        var fileName = `diksha_tpd/report2/${timePeriod}/school/all_collections/${blockId}.json`;
        var schoolData = await s3File.readS3File(fileName);
        var footer = schoolData['footer'][`${clusterId}`];
        schoolData = schoolData.data.filter(a => {
            return a.cluster_id == clusterId;
        });
        var chartData = {
            labels: '',
            data: ''
        }

        schoolData = schoolData.sort((a, b) => (a.school_name > b.school_name) ? 1 : -1);
        chartData['labels'] = schoolData.map(a => {
            return a.school_name
        })
        chartData['data'] = schoolData.map(a => {
            return { enrollment: a.total_enrolled, completion: a.total_completed, percent_teachers: a.percentage_teachers, percent_completion: a.percentage_completion }
        })
        logger.info('--- diksha chart allData api response sent ---');
        res.send({ chartData, downloadData: schoolData, footer });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;