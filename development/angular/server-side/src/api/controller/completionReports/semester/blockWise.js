const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allBlockWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- all blocks semester_completion api ---');
        var sem = req.body.sem;
        let fileName = `exception_list/semester_completion/block_sem_completion_${sem}.json`
        var blockData = await s3File.readS3File(fileName);
        var sortedData = blockData['data'].sort((a, b) => (a.block_name) > (b.block_name) ? 1 : -1)
        logger.info('--- blocks semester_completion api response sent---');
        res.status(200).send({ data: sortedData, footer: blockData.allBlocksFooter.total_schools_with_missing_data });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/blockWise/:distId', auth.authController, async (req, res) => {
    try {
        logger.info('--- block per district semester_completion api ---');
        var sem = req.body.sem;
        let fileName = `exception_list/semester_completion/block_sem_completion_${sem}.json`
        var blockData = await s3File.readS3File(fileName);
        let distId = req.params.distId
        let filterData = blockData.data.filter(obj => {
            return (obj.district_id == distId)
        })
        var sortedData = filterData.sort((a, b) => (a.block_name) > (b.block_name) ? 1 : -1)
        logger.info('--- block per district semester_completion api response sent---');
        res.status(200).send({ data: sortedData, footer: blockData.footer[`${distId}`].total_schools_with_missing_data });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;