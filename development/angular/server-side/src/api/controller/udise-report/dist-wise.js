const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---UDISE dist wise api ---');
        // let fileName = `infra/infra_district_map.json`
        // var districtData = await s3File.readS3File(fileName);
        // var mydata = districtData.data;

        // logger.info('--- UDISE dist wise api response sent ---');
        // res.status(200).send({ data: mydata, footer: districtData.allDistrictsFooter.totalSchools });
        var mydata = [
            {
                "details": {
                    district_id: 2407,
                    district_name: "Kachchh",
                    latitude: 23.3362,
                    longitude: 69.709941667
                },
                "rank": {
                    district_rank: "4 out of 32"
                },
                "indices": {
                    enrolment: 10,
                    school_operation: 70,
                    policy_implementation: 85,
                    infrastructure: 60,
                    school_inspection: 98,
                    community_participation: 66,
                    teacher_profile: 68,
                    school_performance: 58,
                    grant_expenditure: 70,
                    vocational_education: 80,
                    NEP: 75,
                    school_infrastructure_score: 50
                }
            }
        ]
        res.send({ data: mydata, footer: 150 });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;