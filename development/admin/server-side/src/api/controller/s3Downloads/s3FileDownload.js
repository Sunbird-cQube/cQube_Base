const router = require('express').Router();
// var jwtDecode = require('jwt-decode');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const axios = require('axios');
var const_data = require('../../lib/config');

const baseUrl = process.env.BASEURL;

router.post('/listBuckets', auth.authController, async function (req, res) {
    try {
        logger.info("listbucket of s3 api");
        let listBuckets = {
            'input': process.env.INPUT_BUCKET_NAME,
            'output': process.env.OUTPUT_BUCKET_NAME,
            'emission': process.env.EMISSION_BUCKET_NAME
        }
        logger.info("listfolder of s3 api response sent");
        res.status(200).send(listBuckets);
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/listFiles/:bucketName', auth.authController, async function (req, res) {
    try {
        logger.info("listfiles of s3 api");
        const param = {
            Bucket: req.params.bucketName
        };
        async function getAllKeys(params, allKeys = []) {
            const response = await const_data['s3'].listObjectsV2(params).promise();
            response.Contents.forEach(obj => allKeys.push(obj.Key));

            if (response.NextContinuationToken) {
                params.ContinuationToken = response.NextContinuationToken;
                await getAllKeys(params, allKeys); // RECURSIVE CALL
            }
            return allKeys;
        }
        const list = await getAllKeys(param);
        res.status(200).send(list);
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/getDownloadUrl', auth.authController, async function (req, res) {
    try {
        logger.info(`---list s3 Files for bucket ${req.body.bucketName} and fileName ${req.body.fileName} api ---`);
        const params = {
            Bucket: req.body.bucketName,
            Key: req.body.fileName,
            Expires: 60 * 5
        };

        const_data['s3_download'].getSignedUrl('getObject', params, (err, url) => {
            logger.info(" ---- list s3  file for bucket response sent.. ----");
            res.status(200).send({ downloadUrl: url })
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});


module.exports = router;