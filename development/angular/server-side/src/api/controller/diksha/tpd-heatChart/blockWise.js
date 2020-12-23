const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const helper = require('./helper');

router.post('/blockWise', auth.authController, async (req, res) => {
    try {
        logger.info('---diksha tpd  block wise api ---');
        let { timePeriod, reportType, districtId, courses } = req.body
        var fileName = `diksha_tpd/block/${timePeriod}.json`;
        var data = await s3File.readS3File(fileName);

        if (districtId) {
            data = data.filter(val => {
                return val.district_id == districtId
            })
        }

        let blockDetails = data.map(e => {
            return {
                district_id: e.district_id,
                district_name: e.district_name,
                block_id: e.block_id,
                block_name: e.block_name
            }
        })

        blockDetails = blockDetails.reduce((unique, o) => {
            if (!unique.some(obj => obj.block_id === o.block_id)) {
                unique.push(o);
            }
            return unique;
        }, []);
        if (courses.length > 0) {
            data = data.filter(item => {
                return courses.includes(item['collection_id']);
            });
        }
        // res.send(data)
        data = data.sort((a, b) => (a.block_name) > (b.block_name) ? 1 : -1)
        let result = await helper.generalFun(data, 1, reportType)

        logger.info('---diksha tpd  block wise response sent ---');
        res.status(200).send({ blockDetails, result, downloadData: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router