const router = require('express').Router();
const { logger } = require('../../lib/logger');
var groupArray = require('group-array');
const crcHelper = require('./crcHelper');
const auth = require('../../middleware/check-auth');
const s3File = require('./s3File');

router.post('/allBlockWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc all block wise api ---');

        // to store the s3 file data to variables
        let fullData = {}
        fullData = {
            frequencyData: await s3File.frequencyData(),
            crcMetaData: await s3File.crcMetaData()
        }

        // crc meta data group by block id
        let crcMetaDataGroupData = groupArray(fullData.crcMetaData, 'block_id');

        // crc frequency data group by block
        let crcFrequencyGroupData = groupArray(fullData.frequencyData, 'block_id');

        let level = 'block';

        let crcResult = await crcHelper.percentageCalculation(crcMetaDataGroupData, crcFrequencyGroupData, level);
        logger.info('--- crc all block wise api response sent ---');
        res.status(200).send(crcResult);
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
})

router.post('/blockWise/:distId', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc block per district api ---');

        // to store the s3 file data to variables
        let fullData = {}
        fullData = {
            frequencyData: await s3File.frequencyData(),
            crcMetaData: await s3File.crcMetaData()
        }

        // filter crc meta data by district id
        let filterMetaData = fullData.crcMetaData.filter(obj => {
            return obj.district_id == req.params.distId
        })

        // crc meta data group by district id
        let crcMetaDataGroupData = groupArray(filterMetaData, 'block_id');

        // filter crc frequency data by district id
        let filterFrequencyData = fullData.frequencyData.filter(obj => {
            return obj.district_id == req.params.distId
        })

        // crc frequency data group by district_id
        let crcFrequencyGroupData = groupArray(filterFrequencyData, 'block_id');

        let level = 'block';

        let crcResult = await crcHelper.percentageCalculation(crcMetaDataGroupData, crcFrequencyGroupData, level);
        logger.info('--- crc block per district api response sent ---');
        res.status(200).send(crcResult);
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
})

module.exports = router;