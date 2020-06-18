const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');

router.post('/districtWise', async (req, res) => {
    try {
        logger.info('--- crc district wise api ---');
        const_data['getParams']['Key'] = `test/crc_district_test.json`;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                var myData = JSON.parse(data.Body.toString());
                logger.info('--- crc district wise api response sent ---');
                res.status(200).send(myData);
            }
        });

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;