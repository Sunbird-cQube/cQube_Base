const data = (sortedData, grade, subject, start) => {
    var updatedMarkers = [];
    var markersWithSubject = [];
    for (let j = 0; j < sortedData.length; j++) {
        var keys = Object.keys(sortedData[j]);
        if (grade && grade != 'all') {
            var obj1 = {}
            if (subject != '') {
                if (sortedData[j].subjects && sortedData[j].subjects[0][`${subject}`] && Object.keys(sortedData[j].subjects[0]).includes(subject)) {
                    for (let i = 0; i <= start; i++) {
                        obj1[`${keys[i]}`] = sortedData[j][`${keys[i]}`];
                    }
                    obj1['subject'] = subject;
                    var keys2 = Object.keys(sortedData[j].subjects[0][`${subject}`]);
                    for (let i = 0; i < keys2.length; i++) {
                        obj1[`${keys2[i]}`] = sortedData[j].subjects[0][`${subject}`][`${keys2[i]}`];
                    }
                    markersWithSubject.push(obj1);
                } else if (!sortedData[j].subjects) {
                    markersWithSubject.push(sortedData[j]);
                }
            }
        }
        var obj = {};
        Object.keys(sortedData[j]).forEach(key => {
            if (key !== 'subjects') {
                obj[key] = sortedData[j][key];
            }
        });
        updatedMarkers.push(obj);
    }
    var filteredData = [];
    if (subject && grade) {
        filteredData = markersWithSubject;
    } else if (grade && grade != 'all') {
        filteredData = updatedMarkers;
    } else {
        filteredData = sortedData;
    }
    var finalData = filteredData;
    return finalData;
}

module.exports = { data };