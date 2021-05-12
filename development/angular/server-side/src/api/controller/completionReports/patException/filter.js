const data = (sortedData, grade, subject, start, Subjects) => {
    try {
        var updatedMarkers = [];
        var markersWithSubject = [];
        for (let j = 0; j < sortedData.length; j++) {
            var keys = Object.keys(sortedData[j]);
            if (grade && grade != 'all') {
                var obj1 = {}
                if (subject != '') {
                    if (sortedData[j].subjects && Subjects.includes(subject)) {
                        for (let i = 0; i <= start; i++) {
                            obj1[`${keys[i]}`] = sortedData[j][`${keys[i]}`];
                        }
                        obj1['subject'] = subject;
                        sortedData[j].subjects.map(subData => {
                            if (subData[`${subject}`]) {
                                var keys2 = Object.keys(subData[`${subject}`]);
                                for (let i = 0; i < keys2.length; i++) {
                                    obj1[`${keys2[i]}`] = subData[`${subject}`][`${keys2[i]}`];
                                }
                            }
                        });
                        markersWithSubject.push(obj1);
                    } else if (!sortedData[j].subjects) {
                        markersWithSubject.push(sortedData[j]);
                    }
                } else {
                    var obj = {};
                    Object.keys(sortedData[j]).forEach(key => {
                        if (key !== 'subjects') {
                            obj[key] = sortedData[j][key];
                        }
                    });
                    updatedMarkers.push(obj);
                }
            }
        }
        var filteredData = [];
        if (subject && grade && grade != 'all') {
            filteredData = markersWithSubject;
        } else if (grade && grade != 'all' && !subject) {
            filteredData = updatedMarkers;
        } else {
            filteredData = sortedData;
        }
        var finalData = filteredData;
        return finalData;
    } catch (e) {
        return e;
    }
}

module.exports = { data };