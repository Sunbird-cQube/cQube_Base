const generalFun = (data, level, viewBy) => {
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

                data = data.sort((a, b) => (a.grade) > (b.grade) ? 1 : -1)

                Promise.all(data.map(item => {
                    let label = item.exam_date + "/"
                        + "grade" + item.grade + "/"
                        + item.subject_name + "/"
                    label += viewBy == "indicator" ? item.indicator : item.indicator_id

                    arr[label] = arr.hasOwnProperty(label) ? [...arr[label], ...[item]] : [item];

                    let label1 = item.exam_date + "/"
                        + "grade" + item.grade + "/"
                        + item.subject_name + "/"
                        + item.students_attended.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + "/"
                        + item.total_schools.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + "/"
                        + item.total_students.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + "/"

                    label1 += viewBy == "indicator" ? item.indicator : item.indicator_id

                    arr1[label1] = arr1.hasOwnProperty(label1) ? [...arr[label1], ...[item]] : [item];

                })).then(() => {
                })
            }
            let finalData = []

            Promise.all(Object.entries(arr).map((entry, index) => {
                for (let y = 0; y < totalDistLen.length; y++) {
                    let mark = Array.isArray(entry[1]) ? entry[1].filter(itemValue => itemValue[hierarchySelection] == totalDistLen[y])[0] : 0;
                    mark = mark ? parseFloat(mark.marks) : null;
                    finalData.push([y, index, mark])
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
                    data: finalData
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