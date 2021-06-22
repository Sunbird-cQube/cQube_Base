const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/', auth.authController, async (req, res) => {
    try {
        logger.info('---management category meta api ---');
        let fileName = `meta/school_management_category_meta.json`;
        var metaData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var management = [];
        var category = [];
        metaData.management.filter(item => {
            var name = changeingStringCases(item.replace(/_/g, ' '));
            management.push({ id: item, value: name });
        });
        // metaData.category.filter(item => {
        //     var name = changeingStringCases(item.replace(/_/g, ' '));
        //     category.push({ id: item, value: name });
        // });

        function changeingStringCases(str) {
            return str.replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
        var mydata = { management: management, category: category };

        logger.info('---management category meta api response sent ---');
        res.status(200).send({ mydata });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;