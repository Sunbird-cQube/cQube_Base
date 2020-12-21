const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/schoolWise', auth.authController, async (req, res) => {
    try {
        var blockId = req.body.blockId;
        var schoolId = req.body.id;
        logger.info('---healthCard school wise api ---');
        let fileName = `healthCard/school/${blockId}.json`;
        var schoolData = await s3File.readS3File(fileName);
        schoolData = schoolData.filter(a => {
            if (a.school_id == schoolId) {
                return a;
            }
        });
        logger.info('--- healthCard school wise api response sent ---');
        if (schoolData.length > 0) {
            res.status(200).send({ schoolData });
        } else {
            res.status(403).json({ errMessage: "Data not available" });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;