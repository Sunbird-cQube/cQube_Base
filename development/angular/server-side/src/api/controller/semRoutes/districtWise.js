const router = require('express').Router();
var const_data = require('../../lib/config'); // Log Variables
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/districtWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- district wise sem api ---');
        let fileName = `semester/district_sem_opt_json_${req.body.sem}.json`
        var myData = await s3File.readS3File(fileName);

        let districtData = myData.data;

        // res.send(districtData)
        // input date range
        // let startDate = req.body.startDate;
        // let endDate = req.body.endDate;

        // filter state data for specified date range
        // var filterData = districtData.filter(obj => {
        //     return (obj.data_from_date == startDate && obj.data_upto_date == endDate)
        // })
        districtData = districtData.filter(function (el) {
            return el.x_value != null;
        });

        // calculate totalstudents and totalschools of all districts for state
        let totalStudents = myData.allDistrictsFooter.students;
        let totalSchools = myData.allDistrictsFooter.schools;

        // map and extract required  values to show in the leaflet-map
        var districtDetails = districtData.map(function (item) {
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
                value_below_33: item['value_below_33'],
                value_between_33_60: item['value_between_33_60'],
                value_between_60_75: item['value_between_60_75'],
                value_above_75: item['value_above_75'],
                percent_below_33: item['percent_below_33'],
                percent_between_33_60: item['percent_between_33_60'],
                percent_between_60_75: item['percent_between_60_75'],
                percent_above_75: item['percent_above_75']
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
        logger.info('--- semester district wise api reponse sent ---');
        res.status(200).send(resultObj);

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;