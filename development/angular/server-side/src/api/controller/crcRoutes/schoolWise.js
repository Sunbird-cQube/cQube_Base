const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');
var parquet = require('parquetjs-lite');

router.post('/allSchoolWise', async (req, res) => {
    try {
        logger.info('--- crc all school wise api ---');

        const_data['getParams']['Key'] = `test/crc_school_test.snappy`;
        let reader = await parquet.ParquetReader.openS3(const_data['s3'], const_data['getParams']);

        let cursor = reader.getCursor();
        let record = null;
        record = {
            "data": [
                {
                    "visitedSchoolCount": "0",
                    "totalSchools": "1",
                    "districtId": "2401",
                    "districtName": "Kachchh",
                    "blockId": "240101",
                    "blockName": "Lakhapat",
                    "clusterId": "2401010008",
                    "clusterName": "Nara",
                    "schoolId": 24010100201,
                    "schoolName": "Shinapar Primary School",
                    "visit_0": "100.00",
                    "visit_1_2": "0",
                    "visit_3_5": "0",
                    "visit_6_10": "0",
                    "visit_10_more": "0",
                    "totalVisits": "0",
                    "no_of_schools_per_crc": "1.00",
                    "visits_per_school": "0"
                },
                {
                    "visitedSchoolCount": "0",
                    "totalSchools": "1",
                    "districtId": "2401",
                    "districtName": "Kachchh",
                    "blockId": "240101",
                    "blockName": "Lakhapat",
                    "clusterId": "2401010008",
                    "clusterName": "Nara",
                    "schoolId": 24010100301,
                    "schoolName": "Punrajpar Primary School",
                    "visit_0": "100.00",
                    "visit_1_2": "0",
                    "visit_3_5": "0",
                    "visit_6_10": "0",
                    "visit_10_more": "0",
                    "totalVisits": "0",
                    "no_of_schools_per_crc": "1.00",
                    "visits_per_school": "0"
                },
            ],
            "allSchoolsFooter": {
                "totalNumberOfVisits": 972,
                "totalNumberOfSchools": 54728,
                "totalSchoolsVisited": 225,
                "totalSchoolsNotVisited": 54503
            },
            "footer": {
                "2401010008": {
                    "totalNumberOfVisits": 12,
                    "totalNumberOfSchools": 123,
                    "totalSchoolsVisited": 1,
                    "totalSchoolsNotVisited": 122
                },
                "2401010009": {
                    "totalNumberOfVisits": 1,
                    "totalNumberOfSchools": 234,
                    "totalSchoolsVisited": 2,
                    "totalSchoolsNotVisited": 232
                }
            }
        }
        // while (record = await cursor.next()) {
        for (let i = 0; i < record.data.length; i++) {
            record.data[i]['schoolId'] = parseInt(record.data[i].schoolId);
        }
        record.allSchoolsFooter['totalNumberOfVisits'] = parseInt(record.allSchoolsFooter.totalNumberOfVisits);
        record.allSchoolsFooter['totalNumberOfSchools'] = parseInt(record.allSchoolsFooter.totalNumberOfSchools);
        record.allSchoolsFooter['totalSchoolsVisited'] = parseInt(record.allSchoolsFooter.totalSchoolsVisited);
        record.allSchoolsFooter['totalSchoolsNotVisited'] = parseInt(record.allSchoolsFooter.totalSchoolsNotVisited);

        logger.info('--- crc all school wise api response sent ---');
        res.status(200).send({ visits: record.data, schoolsVisitedCount: record.allSchoolsFooter });
        // }
        // await reader.close();
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/schoolWise/:distId/:blockId/:clusterId', async (req, res) => {
    try {
        logger.info('--- crc school per cluster, per block and per district api ---');
        const_data['getParams']['Key'] = `test/crc_school_test.snappy`;
        let reader = await parquet.ParquetReader.openS3(const_data['s3'], const_data['getParams']);

        let cursor = reader.getCursor();
        let record = null;

        record = {
            "data": [
                {
                    "visitedSchoolCount": "0",
                    "totalSchools": "1",
                    "districtId": "2401",
                    "districtName": "Kachchh",
                    "blockId": "240101",
                    "blockName": "Lakhapat",
                    "clusterId": "2401010008",
                    "clusterName": "Nara",
                    "schoolId": 24010100201,
                    "schoolName": "Shinapar Primary School",
                    "visit_0": "100.00",
                    "visit_1_2": "0",
                    "visit_3_5": "0",
                    "visit_6_10": "0",
                    "visit_10_more": "0",
                    "totalVisits": "0",
                    "no_of_schools_per_crc": "1.00",
                    "visits_per_school": "0"
                },
                {
                    "visitedSchoolCount": "0",
                    "totalSchools": "1",
                    "districtId": "2401",
                    "districtName": "Kachchh",
                    "blockId": "240101",
                    "blockName": "Lakhapat",
                    "clusterId": "2401010008",
                    "clusterName": "Nara",
                    "schoolId": 24010100301,
                    "schoolName": "Punrajpar Primary School",
                    "visit_0": "100.00",
                    "visit_1_2": "0",
                    "visit_3_5": "0",
                    "visit_6_10": "0",
                    "visit_10_more": "0",
                    "totalVisits": "0",
                    "no_of_schools_per_crc": "1.00",
                    "visits_per_school": "0"
                },
            ],
            "allSchoolsFooter": {
                "totalNumberOfVisits": 972,
                "totalNumberOfSchools": 54728,
                "totalSchoolsVisited": 225,
                "totalSchoolsNotVisited": 54503
            },
            "footer": {
                "2401010008": {
                    "totalNumberOfVisits": 12,
                    "totalNumberOfSchools": 123,
                    "totalSchoolsVisited": 1,
                    "totalSchoolsNotVisited": 122
                },
                "2401010009": {
                    "totalNumberOfVisits": 1,
                    "totalNumberOfSchools": 234,
                    "totalSchoolsVisited": 2,
                    "totalSchoolsNotVisited": 232
                }
            }
        }

        // while (record = await cursor.next()) {
        let distId = req.params.distId;
        let blockId = req.params.blockId;
        let clusterId = req.params.clusterId;

        let filterData = record.data.filter(obj => {
            return (obj.districtId == distId && obj.blockId == blockId && obj.clusterId == clusterId);
        });

        for (let i = 0; i < filterData.length; i++) {
            filterData[i]['schoolId'] = parseInt(filterData[i].schoolId);
        }
        var schoolsVisitedCount = {
            "totalNumberOfVisits": record.footer[clusterId].totalNumberOfVisits,
            "totalNumberOfSchools": record.footer[clusterId].totalNumberOfSchools,
            "totalSchoolsVisited": record.footer[clusterId].totalSchoolsVisited,
            "totalSchoolsNotVisited": record.footer[clusterId].totalSchoolsNotVisited,
        }
        logger.info('--- crc school per cluster, per block and per district api response sent ---');
        res.status(200).send({ visits: filterData, schoolsVisitedCount: schoolsVisitedCount });
        // }
        // await reader.close();
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;