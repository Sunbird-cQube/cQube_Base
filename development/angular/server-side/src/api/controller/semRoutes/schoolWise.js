const router = require('express').Router();
var const_data = require('../../lib/config'); // Log Variables
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- semseter all school wise api ---');
        const_data['getParams']['Key'] = 'semester/school_assesment_2.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let schoolData = data.Body.toString();
                schoolData = JSON.parse(schoolData);

                // input date range
                // let startDate = req.body.startDate;
                // let endDate = req.body.endDate;

                // filter state data for specified date range
                // filterData = schoolData.filter(obj => {
                //     return (obj.data_from_date == startDate && obj.data_upto_date == endDate)
                // })

                schoolData = schoolData.filter(function (el) {
                    return el.x_value != null;
                });

                // calculate totalstudents and totalschools of all districts for state
                let totalStudents = schoolData.reduce((prev, next) => prev + parseInt(next.students_count), 0);
                let totalSchools = schoolData.length

                // map and extract required  values to show in the leaflet-

                var blockDetails = schoolData.map(function (item) {
                    let obj = {
                        districtId: item['district_id'],
                        districtName: item['district_name'],
                        blockId: item['block_id'],
                        blockName: item['block_name'],
                        clusterId: item['cluster_id'],
                        clusterName: item['cluster_name'],
                        schoolId: item['x_axis'],
                        schoolName: item['school_name'],
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
                        // data_from_date: item['data_from_date'],
                        // data_upto_date: item['data_upto_date']
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
                logger.info('--- semseter all school wise api reponse sent ---');
                res.status(200).send(resultObj);
            }
        })
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        var filterData = '';
        logger.info('--- school wise attendance api ---');
        const_data['getParams']['Key'] = 'semester/school_assesment_2.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let schoolData = data.Body.toString();
                schoolData = JSON.parse(schoolData);

                let distId = req.params.distId
                let blockId = req.params.blockId
                let clusterId = req.params.clusterId


                filterData = schoolData.filter(obj => {
                    return (obj.district_id == distId && obj.block_id == blockId && obj.cluster_id == clusterId)
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
                let totalSchools = filterData.length

                // map and extract required  values to show in the leaflet-map
                var blockDetails = filterData.map(function (item) {
                    let obj = {
                        districtId: item['district_id'],
                        districtName: item['district_name'],
                        blockId: item['block_id'],
                        blockName: item['block_name'],
                        clusterId: item['cluster_id'],
                        clusterName: item['cluster_name'],
                        schoolId: item['x_axis'],
                        schoolName: item['school_name'],
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
                        // data_from_date: item['data_from_date'],
                        // data_upto_date: item['data_upto_date']
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
                logger.info('--- semseter school wise api reponse sent ---');
                res.status(200).send(resultObj);
            }
        })
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;