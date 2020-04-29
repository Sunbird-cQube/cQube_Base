const router = require('express').Router();
var const_data = require('../../lib/config'); // Log Variables
const { logger } = require('../../lib/logger');
var groupArray = require('group-array');

router.post('/districtWise', async(req, res) => {
    try {
        logger.info('--- crc district wise api ---');

        // to store the s3 file data to variables
        let fullData = {}
        fullData = {
            frequencyData: await frequencyData(),
            crcMetaData: await crcMetaData()
        }

        // crc meta data group by district id
        let crcMetaDataGroupData = groupArray(fullData.crcMetaData, 'district_id');

        // crc frequency data group by district_id
        let crcFrequencyGroupData = groupArray(fullData.frequencyData, 'district_id');

        // find total keys of crc frequency group data
        let keys = Object.keys(crcFrequencyGroupData)
        let crcData = [];

        // find visits percentage for particular district based on crc frequency data, 
        // and no_of_schools_per_crc, visits_per_school, percentage_crc_visited_school based on crc meta data
        for (i = 0; i < keys.length; i++) {
            // finding visit_0 percentage
            var visit_0 = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.visit_count == 0)
            })
            let visit_0_Total = '';
            if (visit_0.length > 0) {
                visit_0_Total = visit_0.map(function(a) { return a.visit_count; })
                    .reduce(function(a, b) { return a + b; });
            }

            // finding visit_0 percentage
            var visit_1_2 = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.visit_count >= 1 && obj.visit_count <= 2)
            })
            let visit_1_2_Total = '';
            if (visit_1_2.length > 0) {
                visit_1_2_Total = visit_1_2.map(function(a) { return a.visit_count; })
                    .reduce(function(a, b) { return a + b; });
            }

            // finding visit_3_5 percentage
            var visit_3_5 = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.visit_count >= 3 && obj.visit_count <= 5)
            })
            let visit_3_5_Total = '';
            if (visit_3_5.length > 0) {
                visit_3_5_Total = visit_3_5.map(function(a) { return a.visit_count; })
                    .reduce(function(a, b) { return a + b; });
            }

            // finding visit_6_10 percentage
            var visit_6_10 = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.visit_count >= 6 && obj.visit_count <= 10)
            })
            let visit_6_10_Total = ''
            if (visit_6_10.length > 0) {
                visit_6_10_Total = visit_6_10.map(function(a) { return a.visit_count; })
                    .reduce(function(a, b) { return a + b; });
            }

            // finding visit_10_more percentage
            var visit_10_more = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.visit_count > 10)
            })
            let visit_10_more_Total = ''
            if (visit_10_more.length > 0) {
                visit_10_more_Total = visit_10_more.map(function(a) { return a.visit_count; })
                    .reduce(function(a, b) { return a + b; });
            }

            // let totalVisits = visit_0.length + visit_1_2.length + visit_3_5.length + visit_6_10.length + visit_10_more.length

            // let resultObjVisits = {
            //     districtId: crcFrequencyGroupData[keys[i]][0].district_id,
            //     districtName: crcFrequencyGroupData[keys[i]][0].district_name,
            //     visit_0: (visit_0.length / totalVisits) * 100 + ' %',
            //     visit_1_2: (visit_1_2.length / totalVisits) * 100 + ' %',
            //     visit_3_5: (visit_3_5.length / totalVisits) * 100 + ' %',
            //     visit_6_10: (visit_6_10.length / totalVisits) * 100 + ' %',
            //     visit_10_more: (visit_10_more.length / totalVisits) * 100 + ' %',
            //     totalVisits: totalVisits
            // }

            // to find the distinct cluster_id of crc frequency data for each district
            var frequencyDataFilteredCluster = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.cluster_id)
            })
            const frequencyClusterDistinct = Array.from(frequencyDataFilteredCluster.reduce((m, t) => m.set(t.cluster_id, t), new Map()).values());

            // to find total visits for particular district_id
            let totalVisits = visit_0_Total + visit_1_2_Total + visit_3_5_Total + visit_6_10_Total + visit_10_more_Total

            // all the visits data based on crc frequency data
            let resultObj = {
                districtId: crcFrequencyGroupData[keys[i]][0].district_id,
                districtName: crcFrequencyGroupData[keys[i]][0].district_name,
                visit_0: (visit_0_Total / totalVisits) * 100 + ' %',
                visit_1_2: (visit_1_2_Total / totalVisits) * 100 + ' %',
                visit_3_5: (visit_3_5_Total / totalVisits) * 100 + ' %',
                visit_6_10: (visit_6_10_Total / totalVisits) * 100 + ' %',
                visit_10_more: (visit_10_more_Total / totalVisits) * 100 + ' %',
                totalVisits: totalVisits
            }

            // processing metadata 
            // count of schools for each district
            let schoolData = crcMetaDataGroupData[resultObj.districtId];
            crcMetadataFilteredSchool = schoolData.length;

            // to find the distinct cluster_id of crc meta data for each district
            crcMetadataFilteredCluster = schoolData.filter(obj => {
                return (obj.cluster_id)
            })
            const clusterDupMetadata = Array.from(crcMetadataFilteredCluster.reduce((m, t) => m.set(t.cluster_id, t), new Map()).values());

            // finding all the other values
            let no_of_schools_per_crc = crcMetadataFilteredSchool / clusterDupMetadata.length;
            let visits_per_school = totalVisits / crcMetadataFilteredSchool;
            let percentage_crc_visited_school = (frequencyClusterDistinct.length / clusterDupMetadata.length) * 100

            // assigning the values to keys
            resultObj['no_of_schools_per_crc'] = no_of_schools_per_crc
            resultObj['visits_per_school'] = visits_per_school
            resultObj['percentage_crc_visited_school'] = percentage_crc_visited_school + ' %'
            resultObj['totalSchools'] = crcMetadataFilteredSchool

            crcData.push(resultObj)
        }
        res.send(crcData)
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