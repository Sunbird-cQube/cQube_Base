const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
var const_data = require('../../../lib/config');

router.post('/all_Cluster', async (req, res) => {
    try {
        logger.info('--- get cluster telemetry data api ---');
        let timePeriod = req.body.timePeriod;
        const_data['getParams']['Key'] = `cqube_telemetry/${timePeriod}/clusters.json`;
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                logger.info('--- get cluster telemetry data api response sent ---');
                res.send(JSON.parse(data.Body));
            }
        })
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
})

module.exports = router