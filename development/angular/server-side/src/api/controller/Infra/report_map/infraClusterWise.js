const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const fs = require('fs');
router.post('/allClusterWise', auth.authController, function (req, res) {
    try {
        logger.info('---Infra cluster wise api ---');
        const_data['getParams']['Key'] = `infra/infra_cluster_map.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                var mydata = JSON.parse((data.Body).toString()).map(cluster => {
                    var obj = {
                        lat: cluster.lat,
                        lng: cluster.long,
                        schCount: parseInt(cluster.total_schools_data_received),
                        stdCount: parseInt(cluster.total_students),
                        totalFundReceived: parseInt(cluster.total_central_funds_received).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        fundPerSchoolReceived: parseInt(cluster.funds_per_school).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        fibernet_percent: cluster.fibernet_percent,
                        districtId: cluster.district_id,
                        districtName: cluster.district_name,
                        blockId: cluster.block_id,
                        blockName: cluster.block_name,
                        clusterId: cluster.cluster_id,
                        clusterName: cluster.cluster_name,
                        average_percent: cluster.average_percent,
                        infra_score: cluster.infra_score,
                        hand_wash_percent: cluster.hand_wash_percent,
                        solar_panel_percent: cluster.solar_panel_percent,
                        library_percent: cluster.library_percent,
                        drinking_water_percent: cluster.drinking_water_percent,
                        tap_water_percent: cluster.tap_water_percent,
                        hand_pumps_percent: cluster.hand_pumps_percent,
                        electricity_percent: cluster.electricity_percent,
                        toilet_percent: cluster.toilet_percent,
                        boys_toilet_percent: cluster.boys_toilet_percent,
                        girls_toilet_percent: cluster.girls_toilet_percent

                    }
                    return obj;
                });
                logger.info('---Infra cluster wise api response sent---');
                res.status(200).send(mydata);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra clusterperBlock api ---');
        const_data['getParams']['Key'] = 'infra/infra_cluster_map.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let clusterData = data.Body.toString();
                clusterData = JSON.parse(clusterData);

                let distId = req.params.distId;
                let blockId = req.params.blockId;

                let filterData = clusterData.filter(obj => {
                    return (obj.district_id == distId && obj.block_id == blockId)
                })

                let mydata = filterData.map(cluster => {
                    var obj = {
                        lat: cluster.lat,
                        lng: cluster.long,
                        schCount: parseInt(cluster.total_schools_data_received),
                        stdCount: parseInt(cluster.total_students),
                        totalFundReceived: parseInt(cluster.total_central_funds_received).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        fundPerSchoolReceived: parseInt(cluster.funds_per_school).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        fibernet_percent: cluster.fibernet_percent,
                        districtId: cluster.district_id,
                        districtName: cluster.district_name,
                        blockId: cluster.block_id,
                        blockName: cluster.block_name,
                        clusterId: cluster.cluster_id,
                        clusterName: cluster.cluster_name,
                        average_percent: cluster.average_percent,
                        infra_score: cluster.infra_score,
                        hand_wash_percent: cluster.hand_wash_percent,
                        solar_panel_percent: cluster.solar_panel_percent,
                        library_percent: cluster.library_percent,
                        drinking_water_percent: cluster.drinking_water_percent,
                        tap_water_percent: cluster.tap_water_percent,
                        hand_pumps_percent: cluster.hand_pumps_percent,
                        electricity_percent: cluster.electricity_percent,
                        toilet_percent: cluster.toilet_percent,
                        boys_toilet_percent: cluster.boys_toilet_percent,
                        girls_toilet_percent: cluster.girls_toilet_percent

                    }
                    return obj;
                });
                logger.info('---Infra clusterperBlock api response sent---');
                res.status(200).send(mydata);

            }
        })
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;