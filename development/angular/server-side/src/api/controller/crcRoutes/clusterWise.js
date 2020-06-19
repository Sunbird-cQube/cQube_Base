const router = require('express').Router();
const { logger } = require('../../lib/logger');
var const_data = require('../../lib/config');
const auth = require('../../middleware/check-auth');
var parquet = require('parquetjs-lite');

router.post('/allClusterWise',auth.authController, async (req, res) => {
    try {
        logger.info('--- crc all cluster wise api ---');

        const_data['getParams']['Key'] = `test/crc_cluster_test.snappy`;
        let reader = await parquet.ParquetReader.openS3(const_data['s3'], const_data['getParams']);

        let cursor = reader.getCursor();
        let record = null;

        while (record = await cursor.next()) {
            for (let i = 0; i < record.visits.array.length; i++) {
                record.visits.array[i]['clusterId'] = parseInt(record.visits.array[i].clusterId);
            }
            record.schoolsVisitedCount['totalSchoolsVisited'] = parseInt(record.schoolsVisitedCount.totalSchoolsVisited);
            record.schoolsVisitedCount['totalSchoolsNotVisited'] = parseInt(record.schoolsVisitedCount.totalSchoolsNotVisited);

            logger.info('--- crc all cluster wise api response sent ---');
            res.status(200).send({ visits: record.visits.array, schoolsVisitedCount: record.schoolsVisitedCount });
        }
        await reader.close();
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/clusterWise/:distId/:blockId',auth.authController, async (req, res) => {
    try {
        logger.info('--- crc cluster per block and per district api ---');

        const_data['getParams']['Key'] = `test/crc_cluster_test.snappy`;
        let reader = await parquet.ParquetReader.openS3(const_data['s3'], const_data['getParams']);

        let cursor = reader.getCursor();
        let record = null;

        while (record = await cursor.next()) {
            let distId = req.params.distId;
            let blockId = req.params.blockId;

            let filterData = record.visits.array.filter(obj => {
                return (obj.districtId == distId && obj.blockId == blockId);
            });

            var totalSchoolsVisited = 0;
            var totalSchoolsNotVisited = 0;
            for (let i = 0; i < filterData.length; i++) {
                filterData[i]['clusterId'] = parseInt(filterData[i].clusterId);
                totalSchoolsVisited = totalSchoolsVisited + Number(filterData[i].visitedSchoolCount);
                totalSchoolsNotVisited = totalSchoolsNotVisited + (filterData[i].totalSchools - Number(filterData[i].visitedSchoolCount));
            }
            var schoolsVisitedCount = {
                "totalSchoolsVisited": totalSchoolsVisited,
                "totalSchoolsNotVisited": totalSchoolsNotVisited
            }
            logger.info('---  crc cluster per block and per district api response sent ---');
            res.status(200).send({ visits: filterData, schoolsVisitedCount: schoolsVisitedCount });
        }
        await reader.close();
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;