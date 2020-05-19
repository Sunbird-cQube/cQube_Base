const router = require('express').Router();
const { logger } = require('../../lib/logger');
var groupArray = require('group-array');
const crcHelper = require('./crcHelper');
const auth = require('../../middleware/check-auth');
const s3File = require('./s3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc all school wise api ---');

        // to store the s3 file data to variables
        let fullData = {}
        fullData = {
            frequencyData: await s3File.frequencyData(),
            crcMetaData: await s3File.crcMetaData()
        }

        // crc meta data group by school id
        let crcMetaDataGroupData = groupArray(fullData.crcMetaData, 'school_id');

        // crc frequency data group by school
        let crcFrequencyGroupData = groupArray(fullData.frequencyData, 'school_id');

        let level = 'school';

        let crcResult = await crcHelper.percentageCalculation(crcMetaDataGroupData, crcFrequencyGroupData, level);
        logger.info('--- crc all school wise api reponse sent ---');
        res.send(crcResult)
    } catch (e) {
        console.log(e);
        logger.error(e)
    }
})

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc school per cluster, per block and per district api ---');

        // to store the s3 file data to variables
        let fullData = {}
        fullData = {
            frequencyData: await s3File.frequencyData(),
            crcMetaData: await s3File.crcMetaData()
        }

        // filter crc meta data by district id & block id
        let filterMetaData = fullData.crcMetaData.filter(obj => {
            return (obj.district_id == req.params.distId && obj.block_id == req.params.blockId && obj.cluster_id == req.params.clusterId)
        })

        // crc meta data group by cluster id
        let crcMetaDataGroupData = groupArray(filterMetaData, 'school_id');

        // filter crc frequency data by district id & block id
        let filterFrequencyData = fullData.frequencyData.filter(obj => {
            return (obj.district_id == req.params.distId && obj.block_id == req.params.blockId && obj.cluster_id == req.params.clusterId)
        })

        // crc frequency data group by blocki_id
        let crcFrequencyGroupData = groupArray(filterFrequencyData, 'school_id');

        let level = 'school';

        let crcResult = await crcHelper.percentageCalculation(crcMetaDataGroupData, crcFrequencyGroupData, level);
        logger.info('--- crc school per cluster, per block and per district api sent ---');
        res.send(crcResult)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
})

module.exports = router;