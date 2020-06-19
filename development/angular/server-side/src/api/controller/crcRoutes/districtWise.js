const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');
var parquet = require('parquetjs-lite');

router.post('/districtWise', async (req, res) => {
    try {
        logger.info('--- crc all district wise api ---');

        const_data['getParams']['Key'] = `test/crc_district_test.snappy`;
        let reader = await parquet.ParquetReader.openS3(const_data['s3'], const_data['getParams']);

        let cursor = reader.getCursor();
        let record = null;

        while (record = await cursor.next()) {
            for (let i = 0; i < record.visits.array.length; i++) {
                record.visits.array[i]['totalSchools'] = parseInt(record.visits.array[i].totalSchools);
                record.visits.array[i]['districtId'] = parseInt(record.visits.array[i].districtId);
            }
            record.schoolsVisitedCount['totalSchoolsVisited'] = parseInt(record.schoolsVisitedCount.totalSchoolsVisited);
            record.schoolsVisitedCount['totalSchoolsNotVisited'] = parseInt(record.schoolsVisitedCount.totalSchoolsNotVisited);

            logger.info('--- crc all district api response sent ---');
            res.status(200).send({ visits: record.visits.array, schoolsVisitedCount: record.schoolsVisitedCount });
        }
        await reader.close();
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;