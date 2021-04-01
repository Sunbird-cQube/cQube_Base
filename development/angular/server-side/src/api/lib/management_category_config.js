const router = require('express').Router();
const { logger } = require('../lib/logger');
const fs = require('fs');
const csv = require('csvtojson')

router.get('/', async function(req, res) {
    try {
        logger.info('---management-category default api ---');
        var csvFilePath = `${process.env.BASE_DIR}/cqube/dashboard/default_management_category/default_management_category.csv`;
        var jsonArray;
        if (fs.existsSync(csvFilePath)) {
            jsonArray = await csv().fromFile(csvFilePath);
        }
        logger.info('--- management-category default api response sent ---');
        res.status(200).send(jsonArray);
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;