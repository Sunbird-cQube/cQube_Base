const dotenv = require('dotenv');
const aws = require('aws-sdk');

// Initialize dotenv
dotenv.config();

const DEFAULT_LOG_LEVEL = (process.env.NODE_ENV === 'test') ? 'error' : 'debug';

const Config = {
    port: process.env.PORT,
    Log: process.env.LOG || 'console',
    LogDirectory: process.env.LOG_DIRECTORY,
    fileLogLevel: process.env.FILE_LOG_LEVEL || DEFAULT_LOG_LEVEL,
    consoleLogLevel: process.env.CONSOLE_LOG_LEVEL || DEFAULT_LOG_LEVEL,
    // envName: (() => {
    //     switch (process.env.NODE_ENV) {
    //         case 'DEVELOPMENT':
    //             return 'DEV';
    //         case 'PRODUCTION':
    //             return 'PROD';
    //         default:
    //             return 'DEV';
    //     }
    // })(),
};

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const bucketName = process.env.OUTPUT_BUCKET;
const bucketName1 = process.env.EMISSION_BUCKET;

var S3Config = require('s3-append').S3Config;
var appendConfig = new S3Config({
    "accessKeyId": accessKeyId,
    "secretAccessKey": secretAccessKey,
    "region": "",
    "bucket": bucketName1
});

var s3 = new aws.S3({ 'accessKeyId': accessKeyId, 'secretAccessKey': secretAccessKey });

var getParams = {
    Bucket: bucketName, //replace example bucket with your s3 bucket name
    // Bucket1: bucketName1,
    Key: '', // replace file location with your s3 file location
};

var getParams1 = {
    Bucket: bucketName1, //replace example bucket with your s3 bucket name
    // Bucket1: ,
    Key: '', // replace file location with your s3 file location
};

module.exports = {
    getParams1,
    Config,
    s3,
    getParams,
    appendConfig
};