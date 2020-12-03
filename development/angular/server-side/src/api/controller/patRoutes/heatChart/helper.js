const colorsHelper = require('../../../lib/colors');
const generalFun = (grade, data, level, viewBy) => {
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
                    let date = item.exam_date.split('-')
                    let label = "grade" + item.grade + "/"
                        + date[0] + "-" + date[1] + "/"
                        + item.subject_name

                    label += grade != "" ? viewBy == "indicator" ? "/" + item.indicator : "/" + item.question_id : ''

                    arr[label] = arr.hasOwnProperty(label) ? [...arr[label], ...[item]] : [item];

                    let label1 = item.exam_date + "/"
                        + "grade" + item.grade + "/"
                        + item.subject_name + "/"
                        + item.students_attended.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + "/"
                        + item.total_schools.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + "/"
                        + item.total_students.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + "/"

                    label1 += grade != "" ? viewBy == "indicator" ? "/" + item.indicator : "/" + item.question_id : ''

                    arr1[label1] = arr1.hasOwnProperty(label1) ? [...arr1[label1], ...[item]] : [item];

                })).then(() => {
                })
            }
            let finalData = []

            let colors = grade != "" ? colorsHelper.colors : colorsHelper.colors1
            var keys;
            if (grade == "") {
                keys = Object.keys(colors);
            }
            
            var tooltipData = [];
            Promise.all(Object.entries(arr).map((entry, index) => {
                for (let y = 0; y < totalDistLen.length; y++) {
                    let mark = Array.isArray(entry[1]) ? entry[1].filter(itemValue => itemValue[hierarchySelection] == totalDistLen[y])[0] : 0;
                    tooltipData.push({
                        x: y,
                        y: index,
                        grade: mark ? mark.grade : '',
                        subject: mark ? mark.subject_name : '',
                        exam_date: mark ? mark.exam_date : '',
                        qusetion_id: mark ? parseInt(mark.question_id) : '',
                        indicator: mark ? mark.indicator : '',
                        students_attended: mark ? parseInt(mark.students_attended) : '',
                        total_schools: mark ? parseInt(mark.total_schools) : '',
                        total_students: mark ? parseInt(mark.total_students) : '',
                        name: mark ? mark.district_name && !mark.block_name && !mark.cluster_name && !mark.school_name ? mark.district_name : '' || mark.district_name && mark.block_name && !mark.cluster_name && !mark.school_name ? mark.block_name : '' || mark.block_name && mark.cluster_name && !mark.school_name ? mark.cluster_name : '' || mark.cluster_name && mark.school_name ? mark.school_name : '' : ''

                    })
                    mark = mark ? parseFloat(mark.marks) : null;

                    if (grade == "" && mark != null) {
                        var color = '';
                        for (let i = 0; i < keys.length; i++) {
                            if (mark <= keys[i]) {
                                color = colors[keys[i]];
                                break;
                            } else if (mark > keys[i] && mark <= keys[i + 1]) {
                                color = colors[keys[i + 1]];
                                break;
                            }
                        }
                        finalData.push({ x: y, y: index, value: mark, color: color })
                    } else {
                        finalData.push({ x: y, y: index, value: mark, color: colors[mark] })
                    }
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