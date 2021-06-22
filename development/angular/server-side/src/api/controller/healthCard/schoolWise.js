const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/schoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('---healthCard school wise api ---');
        var blockId = req.body.blockId;
        var schoolId = req.body.id;
        var timePeriod = req.body.timePeriod;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            fileName = `healthCard/school_management_category/${timePeriod}/overall_category/${management}/school/${blockId}.json`;
        } else {
            fileName = `healthCard/school/${timePeriod}/${blockId}.json`;
        }

        var schoolData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        schoolData = schoolData.filter(a => {
            if (a.school_id == schoolId) {
                return a;
            }
        });
        logger.info('--- healthCard school wise api response sent ---');
        if (schoolData.length > 0) {
            schoolData[0] = deleteProps(schoolData[0], ['total_schools']);
            res.status(200).send({ schoolData });
        } else {
            res.status(403).json({ errMessage: "Data not available" });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

function deleteProps(obj, props) {
    if (!Array.isArray(props)) props = [props];
    return Object.keys(obj).reduce((newObj, prop) => {
        if (!props.includes(prop)) {
            newObj[prop] = obj[prop];
        }
        return newObj;
    }, {});
}

module.exports = router;