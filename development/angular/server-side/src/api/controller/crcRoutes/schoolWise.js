const router = require('express').Router();
var const_data = require('../../lib/config'); // Log Variables
const { logger } = require('../../lib/logger');
var groupArray = require('group-array');
const crcHelper = require('./crcHelper');


router.post('/allSchoolWise', async(req, res) => {
    try {
        logger.info('--- crc all school wise api ---');

        // to store the s3 file data to variables
        let fullData = {}
        fullData = {
            frequencyData: await frequencyData(),
            crcMetaData: await crcMetaData()
        }

        // crc meta data group by school id
        let crcMetaDataGroupData = groupArray(fullData.crcMetaData, 'school_id');

        // crc frequency data group by school
        let crcFrequencyGroupData = groupArray(fullData.frequencyData, 'school_id');

        let level = 'school';

        let crcResult = await crcHelper.percentageCalculation(crcMetaDataGroupData, crcFrequencyGroupData, level);

        res.send(crcResult)
    } catch (e) {
        console.log(e);
        logger.error(e)
    }
})

router.post('/schoolWise/:distId/:blockId/:clusterId', async(req, res) => {
    try {
        logger.info('--- crc school per cluster, per block and per district api ---');

        // to store the s3 file data to variables
        let fullData = {}
        fullData = {
            frequencyData: await frequencyData(),
            crcMetaData: await crcMetaData()
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
        console.log(crcFrequencyGroupData);

        let level = 'school';

        let crcResult = await crcHelper.percentageCalculation(crcMetaDataGroupData, crcFrequencyGroupData, level);
        logger.info('---- crc schoolwise response sent ----')
        res.send(crcResult)
    } catch (e) {
        console.log(e);
        logger.error(e)
    }
})

frequencyData = () => {
    return new Promise((resolve, reject) => {
        const_data['getParams']['Key'] = 'CRC/crc_frequency_scatter.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                console.log(err);
                res.send([]);
            } else if (!data) {
                console.log("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                let crcData = data.Body.toString();
                crcData = JSON.parse(crcData);
                resolve(crcData)
            }
        });
    })
}

crcMetaData = () => {
    return new Promise((resolve, reject) => {
        const_data['getParams']['Key'] = 'CRC/crc_metadata.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                console.log(err);
                res.send([]);
            } else if (!data) {
                console.log("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                let crcData = data.Body.toString();
                crcData = JSON.parse(crcData);
                resolve(crcData)
            }
        });
    })
}

module.exports = router;