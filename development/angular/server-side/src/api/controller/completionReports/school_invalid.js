const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');

router.post('/school_invalid_data', auth.authController, async function (req, res) {
    try {
        logger.info(`---school invalid data fileName ${req.body.fileName} api ---`);
        var management = req.body.management;
        var category = req.body.category;
        var fileName;

        if (management != 'overall' && category == 'overall') {
            fileName = `exception_list/static/school_management_category/overall_category/${management}/school_invalid_data.csv`;
        }else{
            fileName = `exception_list/school_invalid_data.csv`;
        }

        const params = {
            Bucket: process.env.OUTPUT_BUCKET,
            Key: fileName,
            Expires: 60 * 5
        };
        const params1 = {
            Bucket: const_data['getParams']['Bucket'],
            Key: fileName
        };
        var url;
        const_data['s3'].headObject(params1, async (err, metadata) => {
            if (!err) {
                url = await const_data['s3'].getSignedUrl('getObject', params);
                logger.info(" ---- file download url sent.. ----");
                res.status(200).send({ downloadUrl: url })
            } else {
                // logger.info(" ---- file download url sent.. ----");
                res.status(403).send({ errMsg: "No such file available" });
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;