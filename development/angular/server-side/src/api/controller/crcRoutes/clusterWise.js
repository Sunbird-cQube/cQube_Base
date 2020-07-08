const router = require('express').Router();
const { logger } = require('../../lib/logger');
var const_data = require('../../lib/config');
const auth = require('../../middleware/check-auth');
var parquet = require('parquetjs-lite');

router.post('/allClusterWise',async (req, res) => {
    try {
        logger.info('--- crc all cluster wise api ---');

        const_data['getParams']['Key'] = `test/crc_cluster_test.snappy`;
        let reader = await parquet.ParquetReader.openS3(const_data['s3'], const_data['getParams']);

        let cursor = reader.getCursor();
        let record = null;
        record = {
            "data": [
              {
                          "visitedSchoolCount": "0",
                          "totalSchools": "10",
                          "districtId": "2401",
                          "districtName": "Kachchh",
                          "blockId": "240101",
                          "blockName": "Lakhapat",
                          "clusterId": 2401010001,
                          "clusterName": "Baranda",
                          "visit_0": "100.00",
                          "visit_1_2": "0",
                          "visit_3_5": "0",
                          "visit_6_10": "0",
                          "visit_10_more": "0",
                          "totalVisits": "0",
                          "no_of_schools_per_crc": "10.00",
                          "visits_per_school": "0"
                      },
                      {
                          "visitedSchoolCount": "0",
                          "totalSchools": "6",
                          "districtId": "2401",
                          "districtName": "Kachchh",
                          "blockId": "240101",
                          "blockName": "Lakhapat",
                          "clusterId": 2401010004,
                          "clusterName": "Ghaduli",
                          "visit_0": "100.00",
                          "visit_1_2": "0",
                          "visit_3_5": "0",
                          "visit_6_10": "0",
                          "visit_10_more": "0",
                          "totalVisits": "0",
                          "no_of_schools_per_crc": "6.00",
                          "visits_per_school": "0"
                      }
            ],
            "allClustersFooter": {
              "totalNumberOfVisits": 972,
              "totalNumberOfSchools": 54728,
              "totalSchoolsVisited": 225,
              "totalSchoolsNotVisited": 54503
            },
            "footer": {
              "240101": {
                "totalNumberOfVisits": 12,
                "totalNumberOfSchools": 123,
                "totalSchoolsVisited": 1,
                "totalSchoolsNotVisited": 122
              },
              "240102": {
                "totalNumberOfVisits": 1,
                "totalNumberOfSchools": 234,
                "totalSchoolsVisited": 2,
                "totalSchoolsNotVisited": 232
              }
            }
          }


        // while (record = await cursor.next()) {
            for (let i = 0; i < record.data.length; i++) {
                record.data[i]['clusterId'] = parseInt(record.data[i].clusterId);
            }
            record.allClustersFooter['totalNumberOfVisits'] = parseInt(record.allClustersFooter.totalNumberOfVisits);
            record.allClustersFooter['totalNumberOfSchools'] = parseInt(record.allClustersFooter.totalNumberOfSchools);
            record.allClustersFooter['totalSchoolsVisited'] = parseInt(record.allClustersFooter.totalSchoolsVisited);
            record.allClustersFooter['totalSchoolsNotVisited'] = parseInt(record.allClustersFooter.totalSchoolsNotVisited);

            logger.info('--- crc all cluster wise api response sent ---');
            res.status(200).send({ visits: record.data, schoolsVisitedCount: record.allClustersFooter });
        // }
        // await reader.close();
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/clusterWise/:distId/:blockId', async (req, res) => {
    try {
        logger.info('--- crc cluster per block and per district api ---');

        const_data['getParams']['Key'] = `test/crc_cluster_test.snappy`;
        let reader = await parquet.ParquetReader.openS3(const_data['s3'], const_data['getParams']);

        let cursor = reader.getCursor();
        let record = null;

        record = {
            "data": [
              {
                          "visitedSchoolCount": "0",
                          "totalSchools": "10",
                          "districtId": "2401",
                          "districtName": "Kachchh",
                          "blockId": "240101",
                          "blockName": "Lakhapat",
                          "clusterId": 2401010001,
                          "clusterName": "Baranda",
                          "visit_0": "100.00",
                          "visit_1_2": "0",
                          "visit_3_5": "0",
                          "visit_6_10": "0",
                          "visit_10_more": "0",
                          "totalVisits": "0",
                          "no_of_schools_per_crc": "10.00",
                          "visits_per_school": "0"
                      },
                      {
                          "visitedSchoolCount": "0",
                          "totalSchools": "6",
                          "districtId": "2401",
                          "districtName": "Kachchh",
                          "blockId": "240101",
                          "blockName": "Lakhapat",
                          "clusterId": 2401010004,
                          "clusterName": "Ghaduli",
                          "visit_0": "100.00",
                          "visit_1_2": "0",
                          "visit_3_5": "0",
                          "visit_6_10": "0",
                          "visit_10_more": "0",
                          "totalVisits": "0",
                          "no_of_schools_per_crc": "6.00",
                          "visits_per_school": "0"
                      }
            ],
            "allClustersFooter": {
              "totalNumberOfVisits": 972,
              "totalNumberOfSchools": 54728,
              "totalSchoolsVisited": 225,
              "totalSchoolsNotVisited": 54503
            },
            "footer": {
              "240101": {
                "totalNumberOfVisits": 12,
                "totalNumberOfSchools": 123,
                "totalSchoolsVisited": 1,
                "totalSchoolsNotVisited": 122
              },
              "240102": {
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

            let filterData = record.data.filter(obj => {
                return (obj.districtId == distId && obj.blockId == blockId);
            });

            for (let i = 0; i < filterData.length; i++) {
                filterData[i]['clusterId'] = parseInt(filterData[i].clusterId);               
            }
            var schoolsVisitedCount = {
                "totalNumberOfVisits": record.footer[blockId].totalNumberOfVisits,
                "totalNumberOfSchools": record.footer[blockId].totalNumberOfSchools,
                "totalSchoolsVisited": record.footer[blockId].totalSchoolsVisited,
                "totalSchoolsNotVisited": record.footer[blockId].totalSchoolsNotVisited,               
            }
            console.log(schoolsVisitedCount);
            
            logger.info('---  crc cluster per block and per district api response sent ---');
            res.status(200).send({ visits: filterData, schoolsVisitedCount: schoolsVisitedCount });
        // }
        // await reader.close();
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;