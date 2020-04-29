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
    //     switch (process.env.NODE_ENV.toUpperCase()) {
    //         case 'DEVELOPMENT':
    //             return 'DEV';
    //         case 'PRODUCTION':
    //             return 'PROD';
    //         default:
    //             return 'DEV';
    //     }
    // })()
};

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const bucketName = process.env.OUTPUT_BUCKET;

var s3 = new aws.S3({ 'accessKeyId': accessKeyId, 'secretAccessKey': secretAccessKey });

var getParams = {
    Bucket: bucketName, //replace example bucket with your s3 bucket name
    Key: '' // replace file location with your s3 file location
};

module.exports = {
    Config,
    s3,
    getParams
};