const router = require('express').Router();
const { logger } = require('../lib/logger');
const auth = require('../middleware/check-auth');
var const_data = require('../lib/config');

router.post('/', auth.authController, async function (req, res) {
    try {
        logger.info(`---raw data download fileName ${req.body.fileName} api ---`);
        const params = {
            Bucket: process.env.OUTPUT_BUCKET,
            Key: req.body.fileName,
            Expires: 60 * 5
        };
        const_data['s3'].getSignedUrl('getObject', params, (err, url) => {
            console.log(err);
            logger.info(" ---- file download url sent.. ----");
            if (err) {
                res.status(403).json({ errMsg: "Internal error" });
            } else {
                res.status(200).send({ downloadUrl: url })
            }
        })

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;