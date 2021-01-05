const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const helper = require('./helper');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha tpd distwise api ---');
        let { timePeriod, reportType, courses } = req.body
        var fileName = `diksha_tpd/district/${timePeriod}.json`;
        var data = await s3File.readS3File(fileName);

        let districtDetails = data.map(e => {
            return {
                district_id: e.district_id,
                district_name: e.district_name
            }
        })

        districtDetails = districtDetails.reduce((unique, o) => {
            if (!unique.some(obj => obj.district_id === o.district_id)) {
                unique.push(o);
            }
            return unique;
        }, []);
        // var courseIds = ['do_3129', 'do_3127'];
        if (courses.length > 0) {
            data = data.filter(item => {
                return courses.includes(item['collection_id']);
            });
        }
        data = data.sort((a, b) => (a.district_name) > (b.district_name) ? 1 : -1)
        let result = await helper.generalFun(data, 0, reportType);

        logger.info('---diksha tpd distwise response sent ---');
        data.map(item => {
            if (reportType == 'percentage_teachers') {
                delete item.collection_progress
            } else {
                delete item.percentage_teachers
            }
        })
        res.status(200).send({ districtDetails, result, downloadData: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router