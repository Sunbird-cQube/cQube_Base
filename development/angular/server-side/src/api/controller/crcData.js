const router = require('express').Router();
const axios = require('axios');
var const_data = require('../config/aws-config');
const auth = require('../middleware/check-auth');

router.get('/crcDistrictWise', async(req, res) => {
    try {
        const_data['getParams']['Key'] = 'CRC/crc_district_wise.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                res.send([]);
            } else if (!data) {
                console.log("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                let crcDistrictData = JSON.parse(data.Body.toString());
                res.send(crcDistrictData)
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/crcBlockWise', async(req, res) => {
    try {
        const_data['getParams']['Key'] = 'CRC/crc_block_wise.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                res.send([]);
            } else if (!data) {
                console.log("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                let crcBlockData = JSON.parse(data.Body.toString());
                res.send(crcBlockData)
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/crcClusterWise', async(req, res) => {
    try {
        const_data['getParams']['Key'] = 'CRC/crc_cluster-wise.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                res.send([]);
            } else if (!data) {
                console.log("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                let crcClusterData = JSON.parse(data.Body.toString());
                res.send(crcClusterData)
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/crcSchoolWise', async(req, res) => {
    try {
        const_data['getParams']['Key'] = 'CRC/crc_school_wise.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                res.send([]);
            } else if (!data) {
                console.log("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                let crcSchoolData = JSON.parse(data.Body.toString());
                res.send(crcSchoolData)
            }
        });
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;