const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.get('/dikshaMetaData',auth.authController, async (req, res) => {
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

router.post('/dikshaAllTableData',auth.authController, async (req, res) => {
    try {
        logger.info('--- dikshaAllTableData api ---');
        var collectionType = req.body.collectionType;
        let fileName = `diksha/table_reports/${collectionType}/All.json`
        var tableData = await s3File.readS3File(fileName);
        res.send(tableData)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/dikshaDistrictTableData', auth.authController, async (req, res) => {
    try {
        logger.info('--- dikshaDistrictTableData api ---');
        var distId = req.body.districtId;
        var collectionType = req.body.collectionType;
        console.log(req.body);
        var fileName = `diksha/table_reports/${collectionType}/${distId}.json`;

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

router.post('/dikshaTimeRangeTableData',auth.authController, async (req, res) => {
    try {
        logger.info('--- dikshaTimeRangeTableData api ---');
        var collectionType = req.body.collectionType;
        var distId = req.body.districtId;
        var timePeriod = req.body.timePeriod;
        console.log(req.body);
        var fileName;
        if (distId) {
            fileName = `diksha/table_reports/${collectionType}/${timePeriod}/${distId}.json`;
        } else {
            fileName = `diksha/table_reports/${collectionType}/${timePeriod}/All.json`;
        }
        var tableData = await s3File.readS3File(fileName);
        res.send(tableData)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router