const router = require('express').Router();
const { logger } = require('../../lib/logger');
var groupArray = require('group-array');
const crcHelper = require('./crcHelper');
const auth = require('../../middleware/check-auth');
const s3File = require('./s3File');

router.post('/allClusterWise', async(req, res) => {
    try {
        logger.info('--- crc all cluster wise api ---');

        // to store the s3 file data to variables
        let fullData = {}
        fullData = {
            frequencyData: await s3File.frequencyData(),
            crcMetaData: await s3File.crcMetaData()
        }

        // crc meta data group by cluster id
        let crcMetaDataGroupData = groupArray(fullData.crcMetaData, 'cluster_id');

        // crc frequency data group by cluster
        let crcFrequencyGroupData = groupArray(fullData.frequencyData, 'cluster_id');

        let level = 'cluster';

        let crcResult = await crcHelper.percentageCalculation(crcMetaDataGroupData, crcFrequencyGroupData, level);
        logger.info('--- crc all cluster wise api response sent ---');
        res.send(crcResult)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
})

router.post('/clusterWise/:distId/:blockId',  async(req, res) => {
    try {
        logger.info('--- crc cluster per block and per district api ---');

        // to store the s3 file data to variables
        let fullData = {}
        fullData = {
            frequencyData: await s3File.frequencyData(),
            crcMetaData: await s3File.crcMetaData()
        }

        // filter crc meta data by district id & block id
        let filterMetaData = fullData.crcMetaData.filter(obj => {
            return (obj.district_id == req.params.distId && obj.block_id == req.params.blockId)
        })

        // crc meta data group by cluster id
        let crcMetaDataGroupData = groupArray(filterMetaData, 'cluster_id');
        // res.send(crcMetaDataGroupData)
        // filter crc frequency data by district id & block id
        let filterFrequencyData = fullData.frequencyData.filter(obj => {
            return (obj.district_id == req.params.distId && obj.block_id == req.params.blockId)
        })

        // crc frequency data group by cluster_id
        let crcFrequencyGroupData = groupArray(filterFrequencyData, 'cluster_id');
        let level = 'cluster';

        let crcResult = await crcHelper.percentageCalculation(crcMetaDataGroupData, crcFrequencyGroupData, level);
        logger.info('--- crc cluster per block and per district api response sent ---');
        res.send(crcResult)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.send({ status: 500, errMessage: "Internal error. Please try again!!" })
    }
})

module.exports = router;