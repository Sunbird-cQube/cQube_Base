const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const fs = require('fs');
router.post('/allSchoolWise', auth.authController, function (req, res) {
    try {
        logger.info('---Infra school wise api ---');
        const_data['getParams']['Key'] = `infra/infra_school_map.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                var mydata = JSON.parse((data.Body).toString()).map(school => {
                    var obj = {
                        lat: school.lat,
                        lng: school.long,
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
                        hand_wash_percent: school.hand_wash_percent,
                        solar_panel_percent: school.solar_panel_percent,
                        library_percent: school.library_percent,
                        drinking_water_percent: school.drinking_water_percent,
                        tap_water_percent: school.tap_water_percent,
                        hand_pumps_percent: school.hand_pumps_percent,
                        electricity_percent: school.electricity_percent,
                        toilet_percent: school.toilet_percent,
                        boys_toilet_percent: school.boys_toilet_percent,
                        girls_toilet_percent: school.girls_toilet_percent,
                        access_to_toilet_percent: school.access_to_toilet_percent,
                        access_to_water_percent: school.access_to_water_percent

                    }
                    return obj;
                });
                logger.info('---Infra school wise api response sent---');
                console.log(mydata.length);
                res.status(200).send(mydata);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra schoolPerCluster api ---');
        const_data['getParams']['Key'] = 'infra/infra_school_map.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let schoolData = data.Body.toString();
                schoolData = JSON.parse(schoolData);

                let distId = req.params.distId;
                let blockId = req.params.blockId;
                let clusterId = req.params.clusterId;

                let filterData = schoolData.filter(obj => {
                    return (obj.district_id == distId && obj.block_id == blockId && obj.cluster_id == clusterId)
                })

                let mydata = filterData.map(school => {
                    var obj = {
                        lat: school.lat,
                        lng: school.long,
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
                        hand_wash_percent: school.hand_wash_percent,
                        solar_panel_percent: school.solar_panel_percent,
                        library_percent: school.library_percent,
                        drinking_water_percent: school.drinking_water_percent,
                        tap_water_percent: school.tap_water_percent,
                        hand_pumps_percent: school.hand_pumps_percent,
                        electricity_percent: school.electricity_percent,
                        toilet_percent: school.toilet_percent,
                        boys_toilet_percent: school.boys_toilet_percent,
                        girls_toilet_percent: school.girls_toilet_percent,
                        access_to_toilet_percent: school.access_to_toilet_percent,
                        access_to_water_percent: school.access_to_water_percent

                    }
                    return obj;
                });
                logger.info('---Infra schoolPerCluster api response sent---');
                res.status(200).send(mydata);

            }
        })
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;