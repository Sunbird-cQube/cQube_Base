const router = require('express').Router();
const { logger } = require('../lib/logger');
const auth = require('../middleware/check-auth');
const fs = require('fs');
const csv = require('csvtojson')

router.get('/', async function (req, res) {
    try {
        logger.info('---dataSource api ---');
        var csvFilePath = `${process.env.BASE_DIR}/cqube/datasource.csv`;
        var jsonArray;
        if (fs.existsSync(csvFilePath)) {
            jsonArray = await csv().fromFile(csvFilePath);
        }
        jsonArray = jsonArray.map(a => {
            if (a.status == 1) {
                a.status = true;
                return a;
            }
            if (a.status == 0) {
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