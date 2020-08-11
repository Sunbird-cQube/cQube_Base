const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.get('/dikshaMetaData', async (req, res) => {
    try {
        logger.info('--- dikshaMetaData api ---');
        let fileName = `diksha/table_reports/diksha_metadata.json`
        var tableData = await s3File.readS3File(fileName);
        if (tableData.districtDetails != null) {
            var sortedData = tableData.districtDetails.sort((a, b) => (a.district_name) > (b.district_name) ? 1 : -1)
            tableData['districtDetails'] = sortedData
        }
        logger.info('--- dikshaMetaData api response sent ---');
        res.send(tableData)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/dikshaAllTableData', async (req, res) => {
    try {
        logger.info('--- dikshaAllTableData api ---');
        let fileName = `diksha/table_reports/${req.body.timePeriod}/All.json`
        var tableData = await s3File.readS3File(fileName);
        res.send(tableData)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/dikshaDistrictTableData', async (req, res) => {
    try {
        logger.info('--- dikshaDistrictTableData api ---');
        console.log(req.body.districtId);
        let fileName = `diksha/table_reports/${req.body.districtId}.json`
        var tableData = await s3File.readS3File(fileName);
        logger.info('--- dikshaDistrictTableData api response sent ---');
        res.send(tableData)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

// router.post('/dikshaAllTimeTableData', async (req, res) => {
//     try {
//         logger.info('--- dikshaAllTimeTableData api ---');
//         let fileName = `diksha/table_reports/`
//         var tableData = await s3File.readS3File(fileName);
//         res.send(tableData)
//     } catch (e) {
//         logger.error(`Error :: ${e}`)
//         res.status(500).json({ errMessage: "Internal error. Please try again!!" });
//     }
// })

router.post('/dikshaTimeRangeTableData', async (req, res) => {
    try {
        logger.info('--- dikshaTimeRangeTableData api ---');
        let fileName = `diksha/table_reports/${req.body.timePeriod}/${req.body.districtId}.json`
        var tableData = await s3File.readS3File(fileName);
        res.send(tableData)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router