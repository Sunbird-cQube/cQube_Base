const router = require('express').Router();
var const_data = require('../../lib/config'); // Log Variables
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allSchoolWise',auth.authController, async (req, res) => {
    try {
        logger.info('--- semseter all school wise api ---');
        let fileName = `semester/school_sem_opt_json_2.json`
        var myData = await s3File.readS3File(fileName);
        
        let schoolData = myData.data;

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
        let totalStudents = myData.allSchoolsFooter.students;
        let totalSchools = myData.allSchoolsFooter.schools;

        // map and extract required  values to show in the leaflet-

        var schoolDetails = schoolData.map(function (item) {
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
        var sortedData = schoolDetails.sort((a, b) => (parseFloat(a.assesmentPercentage) > parseFloat(b.assesmentPercentage)) ? 1 : -1)

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

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        var filterData = '';
        logger.info('--- school wise attendance api ---');
        let fileName = `semester/school_sem_opt_json_2.json`
        var myData = await s3File.readS3File(fileName);

        let schoolData = myData.data;

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
        let totalStudents = myData.footer[`${clusterId}`].students;
        let totalSchools = myData.footer[`${clusterId}`].schools;

        // map and extract required  values to show in the leaflet-map
        var schoolDetails = filterData.map(function (item) {
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
        var sortedData = schoolDetails.sort((a, b) => (parseFloat(a.assesmentPercentage) > parseFloat(b.assesmentPercentage)) ? 1 : -1)

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

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;