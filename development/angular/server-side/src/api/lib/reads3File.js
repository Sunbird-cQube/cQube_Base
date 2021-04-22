var const_data = require('./config');
const { logger } = require('./logger');

const readS3File = (s3Key) => {
    return new Promise((resolve, reject) => {
        try {
            // var params = {
            //     Bucket: const_data['getParams']['Bucket'],
            //     Key: s3Key
            // };
            // const_data['s3'].headObject(params, async (error, metadata) => {
            //     if (!error) {
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
            //     } else {
            //         reject({ errMsg: "file not found" });
            //     }
            // })

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    readS3File
};