const router = require('express').Router();
var const_data = require('../../lib/config'); // Log Variables
const { logger } = require('../../lib/logger');

router.post('/districtWise', (req, res) => {
    try {
        logger.info('--- district wise sem api ---');
        const_data['getParams']['Key'] = 'sem_data/district-wise-assesment.json'
        const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
            if (err) {
                console.log(err);
                res.send([]);
            } else if (!data) {
                console.log("Something went wrong or s3 file not found");
                res.send([]);
            } else {
                let districtData = data.Body.toString();
                districtData = JSON.parse(districtData);

                // res.send(districtData)
                // input date range
                // let startDate = req.body.startDate;
                // let endDate = req.body.endDate;

                // filter state data for specified date range
                // var filterData = districtData.filter(obj => {
                //     return (obj.data_from_date == startDate && obj.data_upto_date == endDate)
                // })

                // calculate totalstudents and totalschools of all districts for state
                let totalStudents = districtData.reduce((prev, next) => prev + parseInt(next.students_count), 0);
                let totalSchools = districtData.reduce((prev, next) => prev + next.total_schools, 0);

                // map and extract required  values to show in the leaflet-map
                var districtDetails = districtData.map(function(item) {
                    let obj = {
                        districtId: item['x_axis'],
                        districtName: item['district_name'],
                        assesmentPercentage: item['x_value'],
                        grade_3: item['grade_3'],
                        grade_4: item['grade_4'],
                        grade_5: item['grade_5'],
                        grade_6: item['grade_6'],
                        grade_7: item['grade_7'],
                        grade_8: item['grade_8'],
                        lat: item['y_value'],
                        lng: item['z_value'],
                        studentsCount: item['students_count'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        schoolsCount: item['total_schools'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        // data_from_date: item['data_from_date'],
                        // data_upto_date: item['data_upto_date']
                    }
                    return obj
                });

                // sort the resultant data based on the attendance percentage to generate color gradients
                var sortedData = districtDetails.sort((a, b) => (parseFloat(a.assesmentPercentage) > parseFloat(b.assesmentPercentage)) ? 1 : -1)

                // final result object
                let resultObj = {
                    totalValues: {
                        totalSchools: totalSchools.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"), // convert number to string and format according to indian -> 1,23,45,789
                        totalStudents: totalStudents.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") // convert number to string and format according to indian -> 1,23,45,789
                    },
                    sortedData
                }
                res.send(resultObj);
            }
        });
    } catch (e) {
        logger.error(e)
    }
})


module.exports = router;