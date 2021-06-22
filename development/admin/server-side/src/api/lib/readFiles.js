var const_data = require('./config');
const { logger } = require('./logger');
const fs = require('fs')
var baseDir = `${process.env.BASE_DIR}/`;
var storageType = `${process.env.STORAGE_TYPE}`;
const readS3File = (s3Key) => {
    return new Promise((resolve, reject) => {
        try {
            const_data['getParams']['Key'] = s3Key;
            const_data['s3'].getObject(const_data['getParams'], function (err, data) {
                if (err) {
                    logger.error(err);
                    reject({ errMsg: "Something went wrong" });
                } else if (!data) {
                    logger.error("No data found in s3 file");
                    reject({ errMsg: "No such data found" });
                } else {
                    var jsonData = JSON.parse(data.Body.toString());
                    resolve(jsonData)
                }
            });
        } catch (e) {
            reject(e)
        }
    })
}


const readLocalFile = (fileName) => {
    return new Promise((resolve, reject) => {
        try {
            fileName = baseDir+fileName;
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    logger.error(err);
                    reject({ errMsg: "Something went wrong" });
                } else if (!data) {
                    logger.error("No data found in s3 file");
                    reject({ errMsg: "No such data found" });
                } else {
                    var jsonData = JSON.parse(data.toString());
                    resolve(jsonData)
                }
            });
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    readS3File, readLocalFile, storageType
};