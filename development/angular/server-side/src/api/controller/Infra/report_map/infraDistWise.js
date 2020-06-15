const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const fs = require('fs');
router.post('/distWise', function (req, res) {
    try {
        logger.info('---Infra dist wise api ---');
        const_data['getParams']['Key'] = `infra/infra_district_map.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                logger.info('--- Infra dist wise api response sent ---');
                var mydata = [];
                JSON.parse((data.Body).toString()).forEach(dist => {
                    var obj = {
                        lat: dist.lat,
                        lng: dist.long,
                        schCount: dist.total_schools,
                        districtId: dist.district_id,
                        districtName: dist.district_name,
                        average_percent: dist.average_percent,
                        infra_score: dist.infra_score,
                        hand_wash_percent: dist.hand_wash_percent,
                        solar_panel_percent: dist.solar_panel_percent,
                        library_percent: dist.library_percent,
                        drinking_water_percent: dist.drinking_water_percent,
                        tap_water_percent: dist.tap_water_percent,
                        hand_pumps_percent: dist.hand_pumps_percent,
                        electricity_percent: dist.electricity_percent,
                        toilet_percent: dist.toilet_percent,
                        boys_toilet_percent: dist.boys_toilet_percent,
                        girls_toilet_percent: dist.girls_toilet_percent

                    }
                    mydata.push(obj);
                });

                res.status(200).send(mydata);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;