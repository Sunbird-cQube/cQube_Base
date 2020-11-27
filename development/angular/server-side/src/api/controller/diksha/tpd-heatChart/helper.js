const colorsHelper = require('../../../lib/colors');
const generalFun = (data, level, reportType) => {
    return new Promise((resolve, reject) => {
        try {
            let totalDistLen = [];
            let totalDistIds = [];
            let arr = {}
            let arr1 = {}
            let hierarchy = {
                0: {
                    name: "district_name",
                    id: "district_id"
                },
                1: {
                    name: "block_name",
                    id: "block_id"
                },
                2: {
                    name: "cluster_name",
                    id: "cluster_id"
                },
                3: {
                    name: "school_name",
                    id: "school_id"
                },
            }
            let hierarchySelection = hierarchy[level].name;
            let hierarchySelectionId = hierarchy[level].id;
            if (Array.isArray(data) && data.length) {
                data.filter(item => {
                    if (totalDistLen.indexOf(item[hierarchySelection]) == -1)
                        totalDistLen.push(item[hierarchySelection])

                    if (totalDistIds.indexOf(item[hierarchySelectionId]) == -1)
                        totalDistIds.push(item[hierarchySelectionId])
                })

                Promise.all(data.map(item => {
                    let label = item.collection_id + "/" + item.collection_name;
                    arr[label] = arr.hasOwnProperty(label) ? [...arr[label], ...[item]] : [item];

                    let label1 = item.collection_id + "/" + item.collection_name;

                    arr1[label1] = arr1.hasOwnProperty(label1) ? [...arr1[label1], ...[item]] : [item];

                })).then(() => {
                })
            }
            let finalData = []
            let colors = colorsHelper.tpdColors;
            let tooltipData = [];
            var keys = Object.keys(colors);
            Promise.all(Object.entries(arr).map((entry, index) => {
                for (let y = 0; y < totalDistLen.length; y++) {
                    let percentVal = Array.isArray(entry[1]) ? entry[1].filter(itemValue => itemValue[hierarchySelection] == totalDistLen[y])[0] : 0;
                    tooltipData.push({
                        x: y,
                        y: index,
                        indicator: percentVal ? percentVal.collection_name : '',
                        name: percentVal ? percentVal.district_name && !percentVal.block_name && !percentVal.cluster_name && !percentVal.school_name ? percentVal.district_name : '' || percentVal.district_name && percentVal.block_name && !percentVal.cluster_name && !percentVal.school_name ? percentVal.block_name : '' || percentVal.block_name && percentVal.cluster_name && !percentVal.school_name ? percentVal.cluster_name : '' || percentVal.cluster_name && percentVal.school_name ? percentVal.school_name : '' : ''
                    })
                    if (reportType == 'percentage_teachers') {
                        percentVal = percentVal ? parseFloat(percentVal.percentage_teachers) : null;
                    } else {
                        percentVal = percentVal ? parseFloat(percentVal.collection_progress) : null;
                    }
                    var color = '';
                    for (let i = 0; i < keys.length; i++) {
                        if (percentVal <= keys[i]) {
                            color = colors[keys[i]];
                            break;
                        } else if (percentVal > keys[i] && percentVal <= keys[i + 1]) {
                            color = colors[keys[i + 1]];
                            break;
                        }
                    }
                    finalData.push({ x: y, y: index, value: percentVal, color: color })
                }
            })).then(() => {
                let arrNew = Object.keys(arr).map(a => {
                    return a.substring(0, 50)
                })
                let obj = {
                    yLabel: arrNew,
                    zLabel: Object.keys(arr1),
                    xLabel: totalDistLen,
                    xLabelId: totalDistIds,
                    data: finalData,
                    tooltipData: tooltipData
                }
                resolve(obj)
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    generalFun
};