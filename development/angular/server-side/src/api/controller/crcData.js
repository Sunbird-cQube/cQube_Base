const router = require('express').Router();
var const_data = require('../../api/lib/config');
const auth = require('../middleware/check-auth');
var groupArray = require('group-array');

let crcs3Data = '';

router.get('/', async function (req, res) {
    try {
        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                return err;
            } else if (!data) {
                return "Something went wrong or s3 file not found"
            } else {
                crcs3Data = data.Body.toString();
                // console.log(crcs3Data);
                crcs3Data = JSON.parse(crcs3Data)
                let visitsCount = await calculateVisits(crcs3Data)
                res.send(visitsCount)
            }
        });

    } catch (e) {
        console.log(e);
    }
});

router.get('/district/:distId', auth.authController, async function (req, res) {
    try {
        let distId = req.params.distId;
        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
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

router.get('/district/:distId/block/:blockId', auth.authController, async function (req, res) {
    try {
        let distId = req.params.distId;
        let blockId = req.params.blockId;
        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
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

router.get('/district/:distId/block/:blockId/cluster/:clusterId', auth.authController, async function (req, res) {
    try {
        let distId = req.params.distId;
        let blockId = req.params.blockId;
        let clusterId = req.params.clusterId;

        const_data['getParams']['Key'] = 'CRC/crc_bar.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
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

router.get('/getDistricts', async function (req, res) {
    try {
        const_data['getParams']['Key'] = 'CRC/crc_bar_table.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                return err;
            } else if (!data) {
                return "Something went wrong or s3 file not found"
            } else {
                crcs3Data = data.Body.toString();
                crcs3Data = JSON.parse(crcs3Data);

                var mapData = crcs3Data.map(function (item) {
                    let obj = {
                        districtId: item['district_id'],
                        districtName: item['district_name']
                    }
                    return obj
                });
                const dedupThings = Array.from(mapData.reduce((m, t) => m.set(t.districtId, t), new Map()).values());
                var filtered = dedupThings.filter(function (el) {
                    return el.districtId != null;
                });
                var tableData = [];

                counter = {}
                counter1 = {}
                distName = [];
                visitedSchoolCount = [];
                notVisitedSchoolCount = [];
                crcs3Data.forEach(function (obj) {
                    if (obj.district_id !== null && obj.visit_count > 0) {
                        var key = JSON.stringify({ id: obj.district_id, name: obj.district_name });
                        counter[JSON.parse(key).name] = (counter[JSON.parse(key).name] || 0) + 1;
                    } else if (obj.district_id !== null && obj.missed_visit_count > 0) {
                        var key = JSON.stringify({ id: obj.district_id, name: obj.district_name });
                        counter1[JSON.parse(key).name] = (counter1[JSON.parse(key).name] || 0) + 1;
                    }
                });
                Object.keys(counter).forEach(key => {
                    distName.push(key);
                });
                Object.values(counter).forEach(value => {
                    visitedSchoolCount.push(value);
                });
                Object.values(counter1).forEach(value => {
                    notVisitedSchoolCount.push(value);
                });

                countVisitesPerDist = [];
                for (var j = 0; j < distName.length; j++) {
                    count = 0;
                    missedCount = 0;
                    for (var i = 0; i < crcs3Data.length; i++) {
                        if (crcs3Data[i].district_name == distName[j]) {
                            count = count + crcs3Data[i].visit_count;
                        };
                    }
                    countVisitesPerDist.push(count);
                };

                for (var i = 0; i < distName.length; i++) {
                    var obj = {
                        district: distName[i],
                        totalSchools: visitedSchoolCount[i] + notVisitedSchoolCount[i],
                        visitedSchoolCount: visitedSchoolCount[i],
                        notVisitedSchoolCount: notVisitedSchoolCount[i],
                        visitsperDist: countVisitesPerDist[i]
                    }
                    tableData.push(obj);
                }
                res.send({ barChartData: filtered, tableData: tableData });
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/getClusters/:distId/:blockId', async function (req, res) {
    try {
        let distId = req.params.distId;
        let blockId = req.params.blockId;

        const_data['getParams']['Key'] = 'CRC/crc_bar_table.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
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
                let mapData = filterData.map(function (item) {
                    let obj = {
                        clusterId: item['cluster_id'],
                        clusterName: item['crc_name']
                    }
                    return obj
                });
                const dedupThings = Array.from(mapData.reduce((m, t) => m.set(t.clusterId, t), new Map()).values());
                var tableData = [];

                counter = {}
                counter1 = {}
                distName = [];
                visitedSchoolCount = [];
                notVisitedSchoolCount = [];
                filterData.forEach(function (obj) {
                    if (obj.cluster_id !== null && obj.visit_count > 0) {
                        var key = JSON.stringify({ id: obj.cluster_id, name: obj.crc_name });
                        counter[JSON.parse(key).name] = (counter[JSON.parse(key).name] || 0) + 1;
                    }
                    if (obj.cluster_id !== null && obj.missed_visit_count !== null) {
                        var key = JSON.stringify({ id: obj.cluster_id, name: obj.crc_name });
                        counter1[JSON.parse(key).name] = (counter1[JSON.parse(key).name] || 0) + 1;
                    }
                });

                Object.keys(counter).forEach(key => {
                    distName.push(key);
                });
                Object.values(counter).forEach(value => {
                    visitedSchoolCount.push(value);
                });
                Object.values(counter1).forEach(value => {
                    notVisitedSchoolCount.push(value);
                });

                countVisitesPerDist = [];
                for (var j = 0; j < distName.length; j++) {
                    count = 0;
                    missedCount = 0;
                    for (var i = 0; i < filterData.length; i++) {
                        if (filterData[i].crc_name == distName[j]) {
                            count = count + filterData[i].visit_count;
                        };
                    }
                    countVisitesPerDist.push(count);
                };

                for (var i = 0; i < distName.length; i++) {
                    var obj = {
                        district: distName[i],
                        totalSchools: visitedSchoolCount[i] + notVisitedSchoolCount[i],
                        visitedSchoolCount: visitedSchoolCount[i],
                        notVisitedSchoolCount: notVisitedSchoolCount[i],
                        visitsperDist: countVisitesPerDist[i]
                    }
                    tableData.push(obj);
                }
                res.send({ barChartData: dedupThings, tableData: tableData });
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/getSchools/:distId/:blockId/:clusterId', async function (req, res) {
    try {
        let distId = req.params.distId;
        let blockId = req.params.blockId;
        let clusterId = req.params.clusterId;

        const_data['getParams']['Key'] = 'CRC/crc_bar_table.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                return err;
            } else if (!data) {
                return "Something went wrong or s3 file not found"
            } else {
                crcs3Data = data.Body.toString();
                crcs3Data = JSON.parse(crcs3Data);
                var filterData = crcs3Data.filter(obj => {
                    return (obj.district_id == distId && obj.block_id == blockId && obj.cluster_id == clusterId)
                })
                let mapData = filterData.map(function (item) {
                    let obj = {
                        clusterId: item['school_id'],
                        clusterName: item['school_name']
                    }
                    return obj
                });
                const dedupThings = Array.from(mapData.reduce((m, t) => m.set(t.clusterId, t), new Map()).values());
                // console.log(dedupThings);
                var tableData = [];

                counter = {}
                counter1 = {}
                distName = [];
                visitedSchoolCount = [];
                notVisitedSchoolCount = [];
                filterData.forEach(function (obj) {
                    console.log(obj);
                    if (obj.school_id !== null && obj.visit_count > 0) {
                        var key = JSON.stringify({ id: obj.school_id, name: obj.school_name });
                        counter[JSON.parse(key).name] = (counter[JSON.parse(key).name] || 0) + 1;
                    }
                    if (obj.school_id !== null && obj.missed_visit_count !== null) {
                        var key = JSON.stringify({ id: obj.school_id, name: obj.school_name });
                        counter1[JSON.parse(key).name] = (counter1[JSON.parse(key).name] || 0) + 1;
                    }
                });
                console.log(counter);
                console.log(counter1);

                Object.keys(counter).forEach(key => {
                    distName.push(key);
                });
                Object.values(counter).forEach(value => {
                    visitedSchoolCount.push(value);
                });
                Object.values(counter1).forEach(value => {
                    notVisitedSchoolCount.push(value);
                });
                console.log(notVisitedSchoolCount);
                
                countVisitesPerDist = [];
                for (var j = 0; j < distName.length; j++) {
                    count = 0;
                    missedCount = 0;
                    for (var i = 0; i < filterData.length; i++) {
                        if (filterData[i].school_name == distName[j]) {
                            count = count + filterData[i].visit_count;
                        };
                    }
                    countVisitesPerDist.push(count);
                };

                for (var i = 0; i < distName.length; i++) {
                    if (filterData[i].missed_visit_count !== 0) {
                        var obj = {
                            district: distName[i],
                            totalSchools: visitedSchoolCount[i],
                            visitedSchoolCount: visitedSchoolCount[i],
                            notVisitedSchoolCount: notVisitedSchoolCount[i],
                            visitsperDist: countVisitesPerDist[i]
                        }
                        console.log(obj);
                        tableData.push(obj);
                    } 
                    else
                        if (filterData[i].missed_visit_count == 0) {
                            var obj = {
                                district: distName[i],
                                totalSchools: visitedSchoolCount[i],
                                visitedSchoolCount: visitedSchoolCount[i],
                                notVisitedSchoolCount: 0,
                                visitsperDist: countVisitesPerDist[i]
                            }
                            console.log(obj);
                            tableData.push(obj);
                        }

                }
                res.send({ barChartData: dedupThings, tableData: tableData });
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/getBlocks/:distId', async function (req, res) {
    try {
        let distId = req.params.distId;
        const_data['getParams']['Key'] = 'CRC/crc_bar_table.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
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
                let mapData = filterData.map(function (item) {
                    let obj = {
                        blockId: item['block_id'],
                        blockName: item['block_name']
                    }
                    return obj
                });
                const dedupThings = Array.from(mapData.reduce((m, t) => m.set(t.blockId, t), new Map()).values());
                var tableData = [];

                counter = {}
                counter1 = {}
                distName = [];
                visitedSchoolCount = [];
                notVisitedSchoolCount = [];
                filterData.forEach(function (obj) {
                    console.log(obj);
                    if (obj.block_id !== null && obj.visit_count > 0) {
                        var key = JSON.stringify({ id: obj.block_id, name: obj.block_name });
                        counter[JSON.parse(key).name] = (counter[JSON.parse(key).name] || 0) + 1;
                    }
                    if (obj.block_id !== null && obj.missed_visit_count !== null) {
                        var key = JSON.stringify({ id: obj.block_id, name: obj.block_name });
                        counter1[JSON.parse(key).name] = (counter1[JSON.parse(key).name] || 0) + 1;
                    }
                });

                Object.keys(counter).forEach(key => {
                    distName.push(key);
                });
                Object.values(counter).forEach(value => {
                    visitedSchoolCount.push(value);
                });
                Object.values(counter1).forEach(value => {
                    notVisitedSchoolCount.push(value);
                });

                countVisitesPerDist = [];
                for (var j = 0; j < distName.length; j++) {
                    count = 0;
                    missedCount = 0;
                    for (var i = 0; i < filterData.length; i++) {
                        if (filterData[i].block_name == distName[j]) {
                            count = count + filterData[i].visit_count;
                        };
                    }
                    countVisitesPerDist.push(count);
                };

                for (var i = 0; i < distName.length; i++) {
                    var obj = {
                        district: distName[i],
                        totalSchools: visitedSchoolCount[i] + notVisitedSchoolCount[i],
                        visitedSchoolCount: visitedSchoolCount[i],
                        notVisitedSchoolCount: notVisitedSchoolCount[i],
                        visitsperDist: countVisitesPerDist[i]
                    }
                    tableData.push(obj);
                }
                res.send({ barChartData: dedupThings, tableData: tableData });
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