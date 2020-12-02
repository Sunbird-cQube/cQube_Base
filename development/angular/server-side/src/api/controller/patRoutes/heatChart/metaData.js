const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const helper = require('./helper');

router.post('/metaData', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT meta data api ---');
        let fileName = `pat/heatChart/metaData.json`
        var data = await s3File.readS3File(fileName);
        // data = data['grades'].sort((a, b) => (a.block_name) > (b.block_name) ? 1 : -1)
        data.map(a => {
            a.data['grades'].sort((x, y) => (x.grade) > (y.grade) ? 1 : -1)
            a.data["viewBy"] = [
                { key: "question_id", value: "Question Id" },
                { key: "indicator", value: "Indicator" }
            ]

        })
        logger.info('--- PAT meta data response sent ---');
        res.status(200).send({ data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router