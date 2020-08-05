const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const fs = require('fs');

router.get('/', async (req, res) => {
    try {
        var filePath = "/home/dheeraj/Desktop/files/telemetry.json";
        logger.info('---telemetry api ---');
        var data = fs.readFileSync(filePath);
        logger.info('---telemetry api response sent---');
        res.status(200).send({ data: JSON.parse(data.toString()) });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;