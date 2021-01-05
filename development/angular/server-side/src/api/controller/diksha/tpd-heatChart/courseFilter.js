const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const helper = require('./helper');

router.post('/', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha tpd distwise api ---');
        let { timePeriod } = req.body
        var fileName = `diksha_tpd/district/${timePeriod}.json`;
        var data = await s3File.readS3File(fileName);
        var courses = [];
        data.map(item => {
            courses.push({ course_id: item['collection_id'], course_name: item['collection_name'] });
        });

        courses = courses.reduce((unique, o) => {
            if (!unique.some(obj => obj.course_id === o.course_id)) {
                unique.push(o);
            }
            return unique;
        }, []);
        res.status(200).send(courses);
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router