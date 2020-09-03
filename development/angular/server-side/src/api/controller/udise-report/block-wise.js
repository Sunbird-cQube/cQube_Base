const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allBlockWise', auth.authController, async (req, res) => {
    try {
        // logger.info('--- all blocks infra api ---');
        // let fileName = `infra/infra_block_map.json`
        // var blockData = await s3File.readS3File(fileName);
        // var mydata = blockData.data;
        // logger.info('--- blocks infra api response sent---');
        var mydata = [
            {
                details: {
                    district_id: 2401,
                    district_name: "Kachchh",
                    block_id: 240101,
                    block_name: "Lakhapat",
                    latitude: 23.636197222,
                    longitude: 68.754551929,
                    district_rank: 4,
                    block_rank: 3
                },
                metrics: {
                    enrolment: 10,
                    school_operation: 10101,
                    policy_implementation: 101,
                    infrastructure: 60,
                    school_inspection: 100,
                    community_participation: 1000,
                    teacher_profile: "",
                    school_performance: 58,
                    grant_expenditure: 70,
                    vocational_education: 80,
                    NEP: 75,
                    school_infrastructure_score: 50
                }
            }
        ]
        res.status(200).send({ data: mydata, footer: 150 });

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/blockWise/:distId', auth.authController, async (req, res) => {
    try {
        // logger.info('--- block wise infra api ---');
        // let fileName = `infra/infra_block_map.json`
        // var blockData = await s3File.readS3File(fileName);
        var blockData = {
            data: [
                {
                    details: {
                        district_id: 2401,
                        district_name: "Kachchh",
                        block_id: 240101,
                        block_name: "Lakhapat",
                        "latitude": 23.636197222,
                        "longitude": 68.754551929,
                        district_rank: 4,
                        block_rank: 3
                    },
                    metrics: {
                        enrolment: 10,
                        school_operation: 10101,
                        policy_implementation: 101,
                        infrastructure: 60,
                        school_inspection: 100,
                        community_participation: 1000,
                        teacher_profile: "",
                        school_performance: 58,
                        grant_expenditure: 70,
                        vocational_education: 80,
                        NEP: 75,
                        school_infrastructure_score: 50
                    }
                }
            ]
        }

        let distId = req.params.distId

        let filterData = blockData.data.filter(obj => {
            return (obj.details.district_id == distId)
        })
        let mydata = filterData;
        logger.info('--- block per dist infra api response sent---');
        res.status(200).send({ data: mydata, footer: 50 });

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;