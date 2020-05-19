const router = require('express').Router();
const { logger } = require('../../lib/logger');
var groupArray = require('group-array');
const crcHelper = require('./crcHelper');
const auth = require('../../middleware/check-auth');
const s3File = require('./s3File');

router.post('/districtWise', async(req, res) => {
    try {
        logger.info('--- crc district wise api ---');

        // to store the s3 file data to variables
        let fullData = {}
        fullData = {
            frequencyData: await s3File.frequencyData(),
            crcMetaData: await s3File.crcMetaData()
        }

        // crc meta data group by district id
        let crcMetaDataGroupData = groupArray(fullData.crcMetaData, 'district_id');

        // crc frequency data group by district_id
        let crcFrequencyGroupData = groupArray(fullData.frequencyData, 'district_id');

        let level = 'district';

        let crcResult = await crcHelper.percentageCalculation(crcMetaDataGroupData, crcFrequencyGroupData, level);
        logger.info('--- crc district wise api response sent ---');
        res.send(crcResult)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
})

module.exports = router;