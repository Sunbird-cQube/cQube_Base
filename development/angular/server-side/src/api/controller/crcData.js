const router = require('express').Router();
var const_data = require('../config/aws-config');
const auth = require('../middleware/check-auth');
var groupArray = require('group-array');

let crcs3Data = '';

router.get('/', async function(req, res) {
    try {
        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                return err;
            } else if (!data) {
                return "Something went wrong or s3 file not found"
            } else {
                crcs3Data = data.Body.toString();
                crcs3Data = JSON.parse(crcs3Data)
                let visitsCount = await calculateVisits(crcs3Data)
                res.send(visitsCount)
            }
        });

    } catch (e) {
        console.log(e);
    }
});

router.get('/district/:distId', auth.authController, async function(req, res) {
    try {
        let distId = req.params.distId;
        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                return err;
            } else if (!data) {
                return "Something went wrong or s3 file not found"
            } else {
                crcs3Data = data.Body.toString();
                crcs3Data = JSON.parse(crcs3Data)
                var filterData = crcs3Data.filter(obj => {
                    return (obj.district_id == distId)
                })
                let visitsCount = await calculateVisits(filterData);
                res.send(visitsCount)
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/district/:distId/block/:blockId', auth.authController, async function(req, res) {
    try {
        let distId = req.params.distId;
        let blockId = req.params.blockId;
        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                return err;
            } else if (!data) {
                return "Something went wrong or s3 file not found"
            } else {
                crcs3Data = data.Body.toString();
                crcs3Data = JSON.parse(crcs3Data)
                var filterData = crcs3Data.filter(obj => {
                    return (obj.district_id == distId && obj.block_id == blockId)
                })
                let visitsCount = await calculateVisits(filterData)
                res.send(visitsCount)
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/district/:distId/block/:blockId/cluster/:clusterId', auth.authController, async function(req, res) {
    try {
        let distId = req.params.distId;
        let blockId = req.params.blockId;
        let clusterId = req.params.clusterId;

        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                return err;
            } else if (!data) {
                return "Something went wrong or s3 file not found"
            } else {
                crcs3Data = data.Body.toString();
                crcs3Data = JSON.parse(crcs3Data)
                var filterData = crcs3Data.filter(obj => {
                    return (obj.district_id == distId && obj.block_id == blockId && obj.cluster_id == clusterId)
                })
                let visitsCount = await calculateVisits(filterData)
                res.send(visitsCount)
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/getDistricts', async function(req, res) {
    try {
        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                return err;
            } else if (!data) {
                return "Something went wrong or s3 file not found"
            } else {
                crcs3Data = data.Body.toString();
                crcs3Data = JSON.parse(crcs3Data);
                var mapData = crcs3Data.map(function(item) {
                    let obj = {
                        districtId: item['district_id'],
                        districtName: item['district_name']
                    }
                    return obj
                });
                const dedupThings = Array.from(mapData.reduce((m, t) => m.set(t.districtId, t), new Map()).values());
                var filtered = dedupThings.filter(function(el) {
                    return el.districtId != null;
                });
                res.send(filtered)
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/getClusters/:distId/:blockId', async function(req, res) {
    try {
        let distId = req.params.distId;
        let blockId = req.params.blockId;

        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                return err;
            } else if (!data) {
                return "Something went wrong or s3 file not found"
            } else {
                crcs3Data = data.Body.toString();
                crcs3Data = JSON.parse(crcs3Data);
                var filterData = crcs3Data.filter(obj => {
                    return (obj.district_id == distId && obj.block_id == blockId)
                })
                let mapData = filterData.map(function(item) {
                    let obj = {
                        clusterId: item['cluster_id'],
                        clusterName: item['crc_name']
                    }
                    return obj
                });
                const dedupThings = Array.from(mapData.reduce((m, t) => m.set(t.clusterId, t), new Map()).values());
                res.send(dedupThings)
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/getBlocks/:distId', async function(req, res) {
    try {
        let distId = req.params.distId;
        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                return err;
            } else if (!data) {
                return "Something went wrong or s3 file not found"
            } else {
                crcs3Data = data.Body.toString();
                crcs3Data = JSON.parse(crcs3Data);
                var filterData = crcs3Data.filter(obj => {
                    return (obj.district_id == distId)
                })
                let mapData = filterData.map(function(item) {
                    let obj = {
                        blockId: item['block_id'],
                        blockName: item['block_name']
                    }
                    return obj
                });
                const dedupThings = Array.from(mapData.reduce((m, t) => m.set(t.blockId, t), new Map()).values());
                res.send(dedupThings)
            }
        });
    } catch (e) {
        console.log(e);
    }
});

calculateVisits = (filterData) => {
    return new Promise((resolve, reject) => {
        // group by the `visits` property
        let result = groupArray(filterData, 'visits');

        let keys = Object.keys(result)
        let resObj = []
            // let totalVisits = 0;
            // let totalSchools = 0;
        for (i = 0; i < keys.length; i++) {
            // totalVisits += parseInt(keys[i]);
            // totalSchools += result[keys[i]].length;
            let obj = {
                schoolsCount: result[keys[i]].length,
                visits: parseInt(keys[i]),
            }
            resObj.push(obj)
        }
        resolve(resObj)
    })
}
module.exports = router;