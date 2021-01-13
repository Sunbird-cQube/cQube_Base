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
        const params1 = {
            Bucket: const_data['getParams']['Bucket'],
            Key: req.body.fileName
        };
        var url;
        const_data['s3'].headObject(params1, async (err, metadata) => {
            if (!err) {
                url = await const_data['s3'].getSignedUrl('getObject', params);
                logger.info(" ---- file download url sent.. ----");
                res.status(200).send({ downloadUrl: url })
            } else {
                logger.info(" ---- file download url sent.. ----");
                res.status(403).send({ errMsg: "No such file available" });
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;