const router = require('express').Router();
const { logger } = require('../lib/logger');
const auth = require('../middleware/check-auth');
const fs = require('fs');
const csv = require('csvtojson')

router.get('/', async function (req, res) {
    try {
        logger.info('---dataSource api ---');
        var csvFilePath = '/home/dheeraj/Documents/cQube_Project/cQube/development/angular/server-side/src/api/lib/data.csv';
        var jsonArray;
        if (fs.existsSync(csvFilePath)) {
            jsonArray = await csv().fromFile(csvFilePath);
        }
        jsonArray = jsonArray.map(a => {
            if (a.status == "true") {
                a.status = true;
                return a;
            }
            if (a.status == "false") {
                a.status = false;
                return a;
            }
        });
        logger.info('--- dataSource api response sent ---');
        res.status(200).send(jsonArray);
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;