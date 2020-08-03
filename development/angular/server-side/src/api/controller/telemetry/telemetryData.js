const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');
const fs = require('fs');

router.post('/', async (req, res) => {
    try {
        logger.info('---telemetry api ---');
        fs.writeFileSync('/home/dheeraj/Documents/cQube_Project/cQube/development/angular/server-side/src/api/controller/telemetry/telemetry.json', JSON.stringify(req.body));
        var data = fs.readFileSync('/home/dheeraj/Documents/cQube_Project/cQube/development/angular/server-side/src/api/controller/telemetry/telemetry.json');

        logger.info('---telemetry api response sent---');
        res.status(200).send({ data: JSON.parse(data.toString()) });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;