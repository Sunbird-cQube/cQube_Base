const percentageCalculation = (crcMetaDataGroupData, crcFrequencyGroupData, level) => {
    return new Promise((resolve, reject) => {
        // find total keys of crc frequency group data
        let keys = Object.keys(crcFrequencyGroupData)
        let frequencySchoolDistinct = 0;
        let metadataSchoolDistinct = 0;
        let finalObj = {
            visits: [],
            schoolsVisitedCount: ''
        }

        // find visits percentage for particular district based on crc frequency data, 
        // and no_of_schools_per_crc, visits_per_school, percentage_crc_visited_school based on crc meta data
        for (i = 0; i < keys.length; i++) {
            // finding visit_0 percentage
            var visit_0 = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.visit_count == 0)
            })

            let visit_0_Total = '';
            if (visit_0.length > 0) {
                visit_0_Total = visit_0.map(function (a) { return a.visit_count; })
                    .reduce(function (a, b) { return a + b; });
            }

            // finding visit_0 percentage
            var visit_1_2 = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.visit_count >= 1 && obj.visit_count <= 2)
            })
            let visit_1_2_Total = '';
            if (visit_1_2.length > 0) {
                visit_1_2_Total = visit_1_2.map(function (a) { return a.visit_count; })
                    .reduce(function (a, b) { return a + b; });
            }

            // finding visit_3_5 percentage
            var visit_3_5 = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.visit_count >= 3 && obj.visit_count <= 5)
            })
            let visit_3_5_Total = '';
            if (visit_3_5.length > 0) {
                visit_3_5_Total = visit_3_5.map(function (a) { return a.visit_count; })
                    .reduce(function (a, b) { return a + b; });
            }

            // finding visit_6_10 percentage
            var visit_6_10 = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.visit_count >= 6 && obj.visit_count <= 10)
            })
            let visit_6_10_Total = ''
            if (visit_6_10.length > 0) {
                visit_6_10_Total = visit_6_10.map(function (a) { return a.visit_count; })
                    .reduce(function (a, b) { return a + b; });
            }

            // finding visit_10_more percentage
            var visit_10_more = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.visit_count > 10)
            })
            let visit_10_more_Total = ''
            if (visit_10_more.length > 0) {
                visit_10_more_Total = visit_10_more.map(function (a) { return a.visit_count; })
                    .reduce(function (a, b) { return a + b; });
            }

            // to find the distinct cluster_id of crc frequency data for each district
            var frequencyDataFilteredCluster = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.cluster_id)
            })
            const frequencyClusterDistinct = Array.from(frequencyDataFilteredCluster.reduce((m, t) => m.set(t.cluster_id, t), new Map()).values());

            // to find the distinct school_id of crc frequency data for each district
            var frequencyDataFilteredSchool = crcFrequencyGroupData[keys[i]].filter(obj => {
                return (obj.school_id)
            })
            let x = Array.from(frequencyDataFilteredSchool.reduce((m, t) => m.set(t.school_id, t), new Map()).values());
            frequencySchoolDistinct += x.length

            let totalVisits = visit_0_Total + visit_1_2_Total + visit_3_5_Total + visit_6_10_Total + visit_10_more_Total
            let totalCRCVisits = visit_0.length + visit_1_2.length + visit_3_5.length + visit_6_10.length + visit_10_more.length

            let resultObj = {
                districtId: crcFrequencyGroupData[keys[i]][0].district_id,
                districtName: crcFrequencyGroupData[keys[i]][0].district_name,
                visit_0: ((visit_0.length / totalCRCVisits) * 100).toFixed(2),
                visit_1_2: ((visit_1_2.length / totalCRCVisits) * 100).toFixed(2),
                visit_3_5: ((visit_3_5.length / totalCRCVisits) * 100).toFixed(2),
                visit_6_10: ((visit_6_10.length / totalCRCVisits) * 100).toFixed(2),
                visit_10_more: ((visit_10_more.length / totalCRCVisits) * 100).toFixed(2),
                totalVisits: totalVisits
            }
            let schoolData = '';
            if (level == 'district') {
                // count of schools for districts
                schoolData = crcMetaDataGroupData[resultObj.districtId];
                crcMetadataFilteredSchool = schoolData.length;
            } else if (level == 'block') {
                resultObj['blockId'] = crcFrequencyGroupData[keys[i]][0].block_id;
                resultObj['blockName'] = crcFrequencyGroupData[keys[i]][0].block_name;
                // count of schools for blocks
                schoolData = crcMetaDataGroupData[resultObj.blockId];
                crcMetadataFilteredSchool = schoolData.length;
            } else if (level == 'cluster') {
                resultObj['blockId'] = crcFrequencyGroupData[keys[i]][0].block_id;
                resultObj['blockName'] = crcFrequencyGroupData[keys[i]][0].block_name;
                resultObj['clusterId'] = crcFrequencyGroupData[keys[i]][0].cluster_id;
                resultObj['clusterName'] = crcFrequencyGroupData[keys[i]][0].cluster_name;
                // count of schools for clusters
                schoolData = crcMetaDataGroupData[resultObj.clusterId];
                crcMetadataFilteredSchool = schoolData.length;
            } else if (level == 'school') {
                resultObj['blockId'] = crcFrequencyGroupData[keys[i]][0].block_id;
                resultObj['blockName'] = crcFrequencyGroupData[keys[i]][0].block_name;
                resultObj['clusterId'] = crcFrequencyGroupData[keys[i]][0].cluster_id;
                resultObj['clusterName'] = crcFrequencyGroupData[keys[i]][0].cluster_name;
                resultObj['schoolId'] = crcFrequencyGroupData[keys[i]][0].school_id;
                resultObj['schoolName'] = crcFrequencyGroupData[keys[i]][0].school_name;

                // count of schools for each school
                schoolData = crcMetaDataGroupData[resultObj.schoolId];
                crcMetadataFilteredSchool = schoolData.length;
            }

            // to find the distinct cluster_id of crc meta data for each district
            var crcMetadataFilteredCluster = schoolData.filter(obj => {
                return (obj.cluster_id)
            })
            const clusterDupMetadata = Array.from(crcMetadataFilteredCluster.reduce((m, t) => m.set(t.cluster_id, t), new Map()).values());

            // to find the distinct school_id of crc meta data for each district
            var crcMetadataFiltereSchool = schoolData.filter(obj => {
                return (obj.school_id)
            })
            let y = Array.from(crcMetadataFiltereSchool.reduce((m, t) => m.set(t.school_id, t), new Map()).values());
            metadataSchoolDistinct += y.length

            // finding all the other values
            let no_of_schools_per_crc = (crcMetadataFilteredSchool / clusterDupMetadata.length).toFixed(2);
            let visits_per_school = (totalVisits / crcMetadataFilteredSchool).toFixed(2);
            let percentage_crc_visited_school = ((frequencyClusterDistinct.length / clusterDupMetadata.length) * 100).toFixed(2)

            // assigning the values to keys
            resultObj['no_of_schools_per_crc'] = no_of_schools_per_crc
            resultObj['visits_per_school'] = visits_per_school
            resultObj['percentage_crc_visited_school'] = percentage_crc_visited_school + ' %'
            resultObj['totalSchools'] = crcMetadataFilteredSchool
            finalObj.visits.push(resultObj)
        }
        let schoolsVisitedCount1 = {
            totalSchoolsVisited: frequencySchoolDistinct,
            totalSchoolsNotVisited: metadataSchoolDistinct - frequencySchoolDistinct
        }
        finalObj['schoolsVisitedCount'] = schoolsVisitedCount1
        resolve(finalObj)
    })
}

module.exports = {
    percentageCalculation
};