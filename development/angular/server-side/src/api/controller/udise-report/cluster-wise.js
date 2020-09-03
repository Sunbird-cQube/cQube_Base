const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        // logger.info('---Infra cluster wise api ---');
        // let fileName = `infra/infra_cluster_map.json`;
        // var clusterData = await s3File.readS3File(fileName);
        // var mydata = clusterData.data;
        var mydata = [
            {
                details: {
                    district_id: 2401,
                    district_name: "Kachchh",
                    block_id: 240101,
                    block_name: "Lakhapat",
                    cluster_id: 2401010001,
                    cluster_name: "Baranda",
                    "latitude": 23.670072222,
                    "longitude": 69.127680556,
                    district_rank: "4/32",
                    block_rank: 3,
                    cluster_rank: 2
                },
                metrics: {
                    enrolment: 10,
                    school_operation: 70,
                    policy_implementation: 85,
                    infrastructure: 60,
                    school_inspection: 98,
                    community_participation: 66,
                    teacher_profile: "",
                    school_performance: 58,
                    grant_expenditure: 70,
                    vocational_education: 80,
                    NEP: 75,
                    school_infrastructure_score: 50
                }
            }
        ]
        logger.info('---Infra cluster wise api response sent---');
        res.status(200).send({ data: mydata, footer: 150 });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        // logger.info('---Infra clusterperBlock api ---');
        // let fileName = `infra/infra_cluster_map.json`;
        // var clusterData = await s3File.readS3File(fileName);
        var clusterData = {
            data: [
                {
                    details: {
                        district_id: 2401,
                        district_name: "Kachchh",
                        block_id: 240101,
                        block_name: "Lakhapat",
                        cluster_id: 2401010001,
                        cluster_name: "Baranda",
                        "latitude": 23.670072222,
                        "longitude": 69.127680556,
                        district_rank: "4/32",
                        block_rank: 3,
                        cluster_rank: 2
                    },
                    metrics: {
                        enrolment: 10,
                        school_operation: 70,
                        policy_implementation: 85,
                        infrastructure: 60,
                        school_inspection: 98,
                        community_participation: 66,
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


        let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.details.district_id == distId && obj.details.block_id == blockId)
        })
        let mydata = filterData;
        logger.info('---Infra clusterperBlock api response sent---');
        res.status(200).send({ data: mydata, footer: 20 });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;