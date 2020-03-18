const aws = require('aws-sdk');
require('dotenv').config();

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

var s3 = new aws.S3({ 'accessKeyId': accessKeyId, 'secretAccessKey': secretAccessKey });

var getParams = {
    Bucket: 'nifi-test-tibil', //replace example bucket with your s3 bucket name
    Key: '' // replace file location with your s3 file location
};

module.exports = { "s3": s3, "getParams": getParams };