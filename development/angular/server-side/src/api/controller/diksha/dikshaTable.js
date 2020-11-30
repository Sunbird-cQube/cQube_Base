const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.get('/dikshaMetaData', auth.authController, async (req, res) => {
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

router.post('/dikshaAllTableData', auth.authController, async (req, res) => {
    try {
        logger.info('--- dikshaAllTableData api ---');
        var collectionType = req.body.collectionType;
        let fileName = `diksha/table_reports/${collectionType}/All.json`
        var tableData = await s3File.readS3File(fileName);
        tableData = tableData.filter(obj => {
            if (obj.district_id == "All" && obj.district_name == '') {
                delete obj.district_id
                delete obj.district_name
                return obj
            }
        })
        logger.info('--- dikshaAllTableData api response sent ---');
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
        var fileName = `diksha/table_reports/${collectionType}/${distId}.json`;

        var tableData = await s3File.readS3File(fileName);
        logger.info('--- dikshaDistrictTableData api response sent ---');
        res.send(tableData)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/dikshaTimeRangeTableData', auth.authController, async (req, res) => {
    try {
        logger.info('--- dikshaTimeRangeTableData api ---');
        var collectionType = req.body.collectionType;
        var distId = req.body.districtId;
        var timePeriod = req.body.timePeriod;
        var fileName;
        var tableData;
        if (req.body.collectionType && distId && timePeriod) {
            fileName = `diksha/table_reports/${collectionType}/${timePeriod}/${distId}.json`;
            tableData = await s3File.readS3File(fileName);
        } else if (!timePeriod) {
            fileName = `diksha/table_reports/${collectionType}/All.json`;
            tableData = await s3File.readS3File(fileName);
            tableData = tableData.filter(obj => {
                if (obj.district_id == "All" && obj.district_name == '') {
                    delete obj.district_id
                    delete obj.district_name
                    return obj
                }
            })
        } else if (req.body.collectionType && timePeriod) {
            fileName = `diksha/table_reports/${collectionType}/${timePeriod}/All.json`;
            tableData = await s3File.readS3File(fileName);
            tableData = tableData.filter(obj => {
                if (obj.district_id == "All" && obj.district_name == '') {
                    delete obj.district_id
                    delete obj.district_name
                    return obj
                }
            })
        }

        logger.info('--- dikshaTimeRangeTableData api response sent ---');
        res.send(tableData)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router