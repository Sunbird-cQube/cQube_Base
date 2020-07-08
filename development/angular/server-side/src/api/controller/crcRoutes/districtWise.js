const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');
var parquet = require('parquetjs-lite');

router.post('/districtWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc all district wise api ---');

        const_data['getParams']['Key'] = `test/crc_district_test.snappy`;
        let reader = await parquet.ParquetReader.openS3(const_data['s3'], const_data['getParams']);

        let cursor = reader.getCursor();
        let record = null;

        record = {
            "data": [
                {
                    "visitedSchoolCount": "0",
                    "totalSchools": "129",
                    "districtId": "2401",
                    "districtName": "Kachchh",
                    "blockId": 240101,
                    "blockName": "Lakhapat",
                    "visit_0": "100.00",
                    "visit_1_2": "0",
                    "visit_3_5": "0",
                    "visit_6_10": "0",
                    "visit_10_more": "0",
                    "totalVisits": "0",
                    "no_of_schools_per_crc": "8.60",
                    "visits_per_school": "0"
                },
                {
                    "visitedSchoolCount": "4",
                    "totalSchools": "349",
                    "districtId": "2401",
                    "districtName": "Kachchh",
                    "blockId": 240102,
                    "blockName": "Rapar",
                    "visit_0": "98.85",
                    "visit_1_2": "0.29",
                    "visit_3_5": "0.29",
                    "visit_6_10": "0.29",
                    "visit_10_more": "0.29",
                    "totalVisits": "24",
                    "no_of_schools_per_crc": "9.97",
                    "visits_per_school": "6.88"
                }
            ],
            "allDistrictFooter": {
                "totalNumberOfVisits": 972,
                "totalNumberOfSchools": 54728,
                "totalSchoolsVisited": 225,
                "totalSchoolsNotVisited": 54503
            }
        }

        // while (record = await cursor.next()) {
        for (let i = 0; i < record.data.length; i++) {
            record.data[i]['districtId'] = parseInt(record.data[i].districtId);
        }
        record.allDistrictFooter['totalNumberOfVisits'] = parseInt(record.allDistrictFooter.totalNumberOfVisits);
        record.allDistrictFooter['totalNumberOfSchools'] = parseInt(record.allDistrictFooter.totalNumberOfSchools);
        record.allDistrictFooter['totalSchoolsVisited'] = parseInt(record.allDistrictFooter.totalSchoolsVisited);
        record.allDistrictFooter['totalSchoolsNotVisited'] = parseInt(record.allDistrictFooter.totalSchoolsNotVisited);

        logger.info('--- crc all district api response sent ---');
        res.status(200).send({ visits: record.data, schoolsVisitedCount: record.allDistrictFooter });
        // }
        // await reader.close();
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;