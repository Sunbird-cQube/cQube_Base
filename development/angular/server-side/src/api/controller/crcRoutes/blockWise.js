const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');
var parquet = require('parquetjs-lite');

router.post('/allBlockWise', async (req, res) => {
    try {
        logger.info('--- crc all block wise api ---');

        const_data['getParams']['Key'] = `test/crc_block_test.snappy`;
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
            "allBlocksFooter": {
                "totalNumberOfVisits": 972,
                "totalNumberOfSchools": 54728,
                "totalSchoolsVisited": 225,
                "totalSchoolsNotVisited": 54503
            },
            "footer": {
                "2401": {
                    "totalNumberOfVisits": 12,
                    "totalNumberOfSchools": 123,
                    "totalSchoolsVisited": 1,
                    "totalSchoolsNotVisited": 122
                },
                "2402": {
                    "totalNumberOfVisits": 1,
                    "totalNumberOfSchools": 234,
                    "totalSchoolsVisited": 2,
                    "totalSchoolsNotVisited": 232
                }
            }
        }

        // while (record = await cursor.next()) {
        for (let i = 0; i < record.data.length; i++) {
            record.data[i]['blockId'] = parseInt(record.data[i].blockId);
        }
        record.allBlocksFooter['totalNumberOfVisits'] = parseInt(record.allBlocksFooter.totalNumberOfVisits);
        record.allBlocksFooter['totalNumberOfSchools'] = parseInt(record.allBlocksFooter.totalNumberOfSchools);
        record.allBlocksFooter['totalSchoolsVisited'] = parseInt(record.allBlocksFooter.totalSchoolsVisited);
        record.allBlocksFooter['totalSchoolsNotVisited'] = parseInt(record.allBlocksFooter.totalSchoolsNotVisited);

        logger.info('--- crc all blocks api response sent ---');
        res.status(200).send({ visits: record.data, schoolsVisitedCount: record.allBlocksFooter });
        // }
        // await reader.close();
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/blockWise/:distId', async (req, res) => {
    try {
        logger.info('--- crc block per district api ---');

        const_data['getParams']['Key'] = `test/crc_block_test.snappy`;
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
            "allBlocksFooter": {
                "totalNumberOfVisits": 972,
                "totalNumberOfSchools": 54728,
                "totalSchoolsVisited": 225,
                "totalSchoolsNotVisited": 54503
            },
            "footer": {
                "2401": {
                    "totalNumberOfVisits": 12,
                    "totalNumberOfSchools": 123,
                    "totalSchoolsVisited": 1,
                    "totalSchoolsNotVisited": 122
                },
                "2402": {
                    "totalNumberOfVisits": 1,
                    "totalNumberOfSchools": 234,
                    "totalSchoolsVisited": 2,
                    "totalSchoolsNotVisited": 232
                }
            }
        }

        // while (record = await cursor.next()) {
        let distId = req.params.distId;

        let filterData = record.data.filter(obj => {
            return (obj.districtId == distId);
        });

        for (let i = 0; i < filterData.length; i++) {
            filterData[i]['blockId'] = parseInt(filterData[i].blockId);
        }
        var schoolsVisitedCount = {
            "totalNumberOfVisits": record.footer[distId].totalNumberOfVisits,
            "totalNumberOfSchools": record.footer[distId].totalNumberOfSchools,
            "totalSchoolsVisited": record.footer[distId].totalSchoolsVisited,
            "totalSchoolsNotVisited": record.footer[distId].totalSchoolsNotVisited,
        }
        logger.info('--- crc block per district api response sent ---');
        res.status(200).send({ visits: filterData, schoolsVisitedCount: schoolsVisitedCount });
        // }
        // await reader.close();  
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;