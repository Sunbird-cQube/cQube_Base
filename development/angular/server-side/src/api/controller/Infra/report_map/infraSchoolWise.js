const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra school wise api ---');
        let fileName = `infra/infra_school_map.json`
        var schoolData = await s3File.readS3File(fileName);
        var mydata = schoolData.data.map(school => {
            var obj = {
                lat: school.school_latitude,
                lng: school.school_longitude,
                schCount: parseInt(school.total_schools_data_received),
                // stdCount: parseInt(school.total_students),
                // totalFundReceived: parseInt(school.total_central_funds_received).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                // fundPerSchoolReceived: parseInt(school.funds_per_school).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                // fibernet_percent: school.fibernet_percent,
                districtId: school.district_id,
                districtName: school.district_name,
                blockId: school.block_id,
                blockName: school.block_name,
                clusterId: school.cluster_id,
                clusterName: school.cluster_name,
                schoolId: school.school_id,
                schoolName: school.school_name,
                // average_percent: school.average_percent,
                infra_score: school.infra_score,
                hand_wash_percent: school.handwash_percent,
                solar_panel_percent: school.solar_panel_percent,
                library_percent: school.library_percent,
                drinking_water_percent: school.drinking_water_percent,
                tap_water_percent: school.tap_water_percent,
                hand_pumps_percent: school.hand_pumps_percent,
                electricity_percent: school.electricity_percent,
                toilet_percent: school.toilet_percent,
                boys_toilet_percent: school.boys_toilet_percent,
                girls_toilet_percent: school.girls_toilet_percent,
                access_to_water_percent: school.access_to_water_percent,
                access_to_toilet_percent: school.access_to_toilet_percent

            }
            return obj;
        });
        logger.info('---Infra school wise api response sent---');
        res.status(200).send({ data: mydata, footer: schoolData.allSchoolsFooter.totalSchools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra schoolPerCluster api ---');
        let fileName = `infra/infra_school_map.json`
        var schoolData = await s3File.readS3File(fileName);

        let distId = req.params.distId;
        let blockId = req.params.blockId;
        let clusterId = req.params.clusterId;

        let filterData = schoolData.data.filter(obj => {
            return (obj.district_id == distId && obj.block_id == blockId && obj.cluster_id == clusterId)
        })

        let mydata = filterData.map(school => {
            var obj = {
                lat: school.school_latitude,
                lng: school.school_longitude,
                schCount: parseInt(school.total_schools_data_received),
                // stdCount: parseInt(school.total_students),
                // totalFundReceived: parseInt(school.total_central_funds_received).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                // fundPerSchoolReceived: parseInt(school.funds_per_school).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                // fibernet_percent: school.fibernet_percent,
                districtId: school.district_id,
                districtName: school.district_name,
                blockId: school.block_id,
                blockName: school.block_name,
                clusterId: school.cluster_id,
                clusterName: school.cluster_name,
                schoolId: school.school_id,
                schoolName: school.school_name,
                // average_percent: school.average_percent,
                infra_score: school.infra_score,
                hand_wash_percent: school.handwash_percent,
                solar_panel_percent: school.solar_panel_percent,
                library_percent: school.library_percent,
                drinking_water_percent: school.drinking_water_percent,
                tap_water_percent: school.tap_water_percent,
                hand_pumps_percent: school.hand_pumps_percent,
                electricity_percent: school.electricity_percent,
                toilet_percent: school.toilet_percent,
                boys_toilet_percent: school.boys_toilet_percent,
                girls_toilet_percent: school.girls_toilet_percent,
                access_to_water_percent: school.access_to_water_percent,
                access_to_toilet_percent: school.access_to_toilet_percent

            }
            return obj;
        });
        logger.info('---Infra schoolPerCluster api response sent---');
        res.status(200).send({ data: mydata, footer: schoolData.footer[`${clusterId}`].totalSchools });

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;