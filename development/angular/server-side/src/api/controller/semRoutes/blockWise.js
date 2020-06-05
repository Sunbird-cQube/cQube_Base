const router = require('express').Router();
var const_data = require('../../lib/config'); // Log Variables
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

router.post('/allBlockWise', auth.authController, async (req, res) => {
    try {
        var filterData = ''
        logger.info('--- all blocks sem api ---');
        const_data['getParams']['Key'] = 'semester/block_assesment_2.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let blockData = data.Body.toString();
                blockData = JSON.parse(blockData);

                // input date range
                // let startDate = req.body.startDate;
                // let endDate = req.body.endDate;

                // filter state data for specified date range
                // filterData = blockData.filter(obj => {
                //     return (obj.data_from_date == startDate && obj.data_upto_date == endDate)
                // })

                blockData = blockData.filter(function (el) {
                    return el.x_value != null;
                });
                // calculate totalstudents and totalschools of all districts for state
                let totalStudents = blockData.reduce((prev, next) => prev + parseInt(next.students_count), 0);
                let totalSchools = blockData.reduce((prev, next) => prev + next.total_schools, 0);

                // map and extract required  values to show in the leaflet-map
                var blockDetails = blockData.map(function (item) {
                    let obj = {
                        districtId: item['district_id'],
                        districtName: item['district_name'],
                        blockId: item['x_axis'],
                        blockName: item['block_name'],
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
                sortedData = blockDetails.sort((a, b) => (parseFloat(a.assesmentPercentage) > parseFloat(b.assesmentPercentage)) ? 1 : -1)

                // final result object
                let resultObj = {
                    totalValues: {
                        totalSchools: totalSchools.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"), // convert number to string and format according to indian -> 1,23,45,789
                        totalStudents: totalStudents.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") // convert number to string and format according to indian -> 1,23,45,789
                    },
                    sortedData
                }
                logger.info('--- semester block wise api reponse sent ---');
                res.status(200).send(resultObj);
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/blockWise/:distId', auth.authController, async (req, res) => {
    try {
        var filterData = '';
        logger.info('--- block wise attendance api ---');
        const_data['getParams']['Key'] = 'semester/block_assesment_2.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let blockData = data.Body.toString();
                blockData = JSON.parse(blockData);

                let distId = req.params.distId

                filterData = blockData.filter(obj => {
                    return (obj.district_id == distId)
                })

                // input date range
                // let startDate = req.body.startDate;
                // let endDate = req.body.endDate;

                // filter state data for specified date range
                // filterData = filterData.filter(obj => {
                //     return (obj.data_from_date == startDate && obj.data_upto_date == endDate)
                // })

                filterData = filterData.filter(function (el) {
                    return el.x_value != null;
                });

                // calculate totalstudents and totalschools of all districts for state
                let totalStudents = filterData.reduce((prev, next) => prev + parseInt(next.students_count), 0);
                let totalSchools = filterData.reduce((prev, next) => prev + next.total_schools, 0);

                // map and extract required  values to show in the leaflet-map
                var blockDetails = filterData.map(function (item) {
                    let obj = {
                        districtId: item['district_id'],
                        districtName: item['district_name'],
                        blockId: item['x_axis'],
                        blockName: item['block_name'],
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
                sortedData = blockDetails.sort((a, b) => (parseFloat(a.assesmentPercentage) > parseFloat(b.assesmentPercentage)) ? 1 : -1)

                // final result object
                let resultObj = {
                    totalValues: {
                        totalSchools: totalSchools.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"), // convert number to string and format according to indian -> 1,23,45,789
                        totalStudents: totalStudents.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") // convert number to string and format according to indian -> 1,23,45,789
                    },
                    sortedData
                }
                logger.info('--- semester block wise api reponse sent ---');
                res.status(200).send(resultObj);
            }
        })
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;