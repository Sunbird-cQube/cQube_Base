const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra cluster wise api ---');
        let fileName = `infra/infra_cluster_map.json`
        var clusterData = await s3File.readS3File(fileName);
        var mydata = clusterData.data.map(cluster => {
            var obj = {
                lat: cluster.cluster_latitude,
                lng: cluster.cluster_longitude,
                schCount: parseInt(cluster.total_schools_data_received),
                // stdCount: parseInt(cluster.total_students),
                // totalFundReceived: parseInt(cluster.total_central_funds_received).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                // fundPerSchoolReceived: parseInt(cluster.funds_per_school).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                // fibernet_percent: cluster.fibernet_percent,
                districtId: cluster.district_id,
                districtName: cluster.district_name,
                blockId: cluster.block_id,
                blockName: cluster.block_name,
                clusterId: cluster.cluster_id,
                clusterName: cluster.cluster_name,
                // average_percent: cluster.average_percent,
                infra_score: cluster.infra_score,
                hand_wash_percent: cluster.handwash_percent,
                solar_panel_percent: cluster.solar_panel_percent,
                library_percent: cluster.library_percent,
                drinking_water_percent: cluster.drinking_water_percent,
                tap_water_percent: cluster.tap_water_percent,
                hand_pumps_percent: cluster.hand_pumps_percent,
                electricity_percent: cluster.electricity_percent,
                toilet_percent: cluster.toilet_percent,
                boys_toilet_percent: cluster.boys_toilet_percent,
                girls_toilet_percent: cluster.girls_toilet_percent,
                access_to_water_percent: cluster.access_to_water_percent,
                access_to_toilet_percent: cluster.access_to_toilet_percent

            }
            return obj;
        });
        logger.info('---Infra cluster wise api response sent---');
        res.status(200).send({ data: mydata, footer: clusterData.allClustersFooter.totalSchools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra clusterperBlock api ---');
        let fileName = `infra/infra_cluster_map.json`
        var clusterData = await s3File.readS3File(fileName);

        let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.district_id == distId && obj.block_id == blockId)
        })
        let mydata = filterData.map(cluster => {
            var obj = {
                lat: cluster.cluster_latitude,
                lng: cluster.cluster_longitude,
                schCount: parseInt(cluster.total_schools_data_received),
                // stdCount: parseInt(cluster.total_students),
                // totalFundReceived: parseInt(cluster.total_central_funds_received).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                // fundPerSchoolReceived: parseInt(cluster.funds_per_school).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                // fibernet_percent: cluster.fibernet_percent,
                districtId: cluster.district_id,
                districtName: cluster.district_name,
                blockId: cluster.block_id,
                blockName: cluster.block_name,
                clusterId: cluster.cluster_id,
                clusterName: cluster.cluster_name,
                // average_percent: cluster.average_percent,
                infra_score: cluster.infra_score,
                hand_wash_percent: cluster.handwash_percent,
                solar_panel_percent: cluster.solar_panel_percent,
                library_percent: cluster.library_percent,
                drinking_water_percent: cluster.drinking_water_percent,
                tap_water_percent: cluster.tap_water_percent,
                hand_pumps_percent: cluster.hand_pumps_percent,
                electricity_percent: cluster.electricity_percent,
                toilet_percent: cluster.toilet_percent,
                boys_toilet_percent: cluster.boys_toilet_percent,
                girls_toilet_percent: cluster.girls_toilet_percent,
                access_to_water_percent: cluster.access_to_water_percent,
                access_to_toilet_percent: cluster.access_to_toilet_percent

            }
            return obj;
        });
        logger.info('---Infra clusterperBlock api response sent---');
        res.status(200).send({ data: mydata, footer: clusterData.footer[`${blockId}`].totalSchools });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;