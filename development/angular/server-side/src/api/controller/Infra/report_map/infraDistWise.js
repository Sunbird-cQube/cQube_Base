const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/distWise', async (req, res) => {
    try {
        logger.info('---Infra dist wise api ---');
        let fileName = `infra/infra_district_map.json`
        var districtData = await s3File.readS3File(fileName);

        var mydata = districtData.data.map(dist => {
            var obj = {
                lat: dist.district_latitude,
                lng: dist.district_longitude,
                schCount: parseInt(dist.total_schools_data_received),
                // stdCount: parseInt(dist.total_students),
                // totalFundReceived: parseInt(dist.total_central_funds_received).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                // fundPerSchoolReceived: parseInt(dist.funds_per_school).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                // fibernet_percent: dist.fibernet_percent,
                districtId: dist.district_id,
                districtName: dist.district_name,
                // average_percent: dist.average_percent,
                infra_score: dist.infra_score,
                hand_wash_percent: dist.handwash_percent,
                solar_panel_percent: dist.solar_panel_percent,
                library_percent: dist.library_percent,
                drinking_water_percent: dist.drinking_water_percent,
                tap_water_percent: dist.tap_water_percent,
                hand_pumps_percent: dist.hand_pumps_percent,
                electricity_percent: dist.electricity_percent,
                toilet_percent: dist.toilet_percent,
                boys_toilet_percent: dist.boys_toilet_percent,
                girls_toilet_percent: dist.girls_toilet_percent,
                access_to_water_percent: dist.access_to_water_percent,
                access_to_toilet_percent: dist.access_to_toilet_percent

            }
            return obj;
        });

        logger.info('--- Infra dist wise api response sent ---');
        res.status(200).send({ data: mydata, footer: districtData.allDistrictsFooter.totalSchools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;