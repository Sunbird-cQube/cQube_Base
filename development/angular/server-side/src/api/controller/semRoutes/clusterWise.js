const router = require('express').Router();
var const_data = require('../../lib/config'); // Log Variables
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- all cluster wise attendance api ---');
        let fileName = `semester/cluster_sem_opt_json_${req.body.sem}.json`
        var myData = await s3File.readS3File(fileName);

        let clusterData = myData.data;

        clusterData = clusterData.filter(function (el) {
            return el.x_value != null;
        });

        // calculate totalstudents and totalschools of all districts for state
        let totalStudents = myData.allClustersFooter.students;
        let totalSchools = myData.allClustersFooter.schools;

        // map and extract required  values to show in the leaflet-map
        var blockDetails = clusterData.map(function (item) {
            let obj = {
                semester_performance: item['x_value'],
                cluster_id: item['x_axis'],
                cluster_name: item['cluster_name'],
                block_id: item['block_id'],
                block_name: item['block_name'],
                district_id: item['district_id'],
                district_name: item['district_name'],
                grade_3: item['grade_3'],
                grade_4: item['grade_4'],
                grade_5: item['grade_5'],
                grade_6: item['grade_6'],
                grade_7: item['grade_7'],
                grade_8: item['grade_8'],
                lat: item['y_value'],
                lng: item['z_value'],
                number_of_students: item['students_count'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                number_of_schools: item['total_schools'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                "less than 33%": item.percent_below_33 + " %" + ` (${item.value_below_33} out of ${item.total_schools})`,
                "33% to 60%": item.percent_between_33_60 + " %" + ` (${item.value_between_33_60} out of ${item.total_schools})`,
                "60% to 75%": item.percent_between_60_75 + " %" + ` (${item.value_between_60_75} out of ${item.total_schools})`,
                "above 75%": item.percent_above_75 + " %" + ` (${item.value_above_75} out of ${item.total_schools})`,
            }
            return obj
        });

        // sort the resultant data based on the attendance percentage to generate color gradients
        var sortedData = blockDetails.sort((a, b) => (parseFloat(a.semester_performance) > parseFloat(b.semester_performance)) ? 1 : -1)

        // final result object
        let resultObj = {
            totalValues: {
                totalSchools: totalSchools.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"), // convert number to string and format according to indian -> 1,23,45,789
                totalStudents: totalStudents.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") // convert number to string and format according to indian -> 1,23,45,789
            },
            sortedData
        }
        logger.info('--- semseter cluster wise api reponse sent ---');
        res.status(200).send(resultObj);

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        var filterData = ''
        logger.info('--- cluster per block semester api ---');
        let fileName = `semester/cluster_sem_opt_json_${req.body.sem}.json`
        var myData = await s3File.readS3File(fileName);
        let clusterData = myData.data;

        let distId = req.params.distId
        let blockId = req.params.blockId

        filterData = clusterData.filter(obj => {
            return (obj.district_id == distId && obj.block_id == blockId)
        })


        filterData = filterData.filter(function (el) {
            return el.x_value != null;
        });


        // calculate totalstudents and totalschools of all districts for state
        let totalStudents = myData.footer[`${blockId}`].students;
        let totalSchools = myData.footer[`${blockId}`].schools;

        // map and extract required  values to show in the leaflet-map
        var blockDetails = filterData.map(function (item) {
            let obj = {
                semester_performance: item['x_value'],
                cluster_id: item['x_axis'],
                cluster_name: item['cluster_name'],
                block_id: item['block_id'],
                block_name: item['block_name'],
                district_id: item['district_id'],
                district_name: item['district_name'],
                grade_3: item['grade_3'],
                grade_4: item['grade_4'],
                grade_5: item['grade_5'],
                grade_6: item['grade_6'],
                grade_7: item['grade_7'],
                grade_8: item['grade_8'],
                lat: item['y_value'],
                lng: item['z_value'],
                number_of_students: item['students_count'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                number_of_schools: item['total_schools'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                "less than 33%": item.percent_below_33 + " %" + ` (${item.value_below_33} out of ${item.total_schools})`,
                "33% to 60%": item.percent_between_33_60 + " %" + ` (${item.value_between_33_60} out of ${item.total_schools})`,
                "60% to 75%": item.percent_between_60_75 + " %" + ` (${item.value_between_60_75} out of ${item.total_schools})`,
                "above 75%": item.percent_above_75 + " %" + ` (${item.value_above_75} out of ${item.total_schools})`,
            }
            return obj
        });

        // sort the resultant data based on the attendance percentage to generate color gradients
        var sortedData = blockDetails.sort((a, b) => (parseFloat(a.semester_performance) > parseFloat(b.semester_performance)) ? 1 : -1)

        // final result object
        let resultObj = {
            totalValues: {
                totalSchools: totalSchools.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"), // convert number to string and format according to indian -> 1,23,45,789
                totalStudents: totalStudents.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") // convert number to string and format according to indian -> 1,23,45,789
            },
            sortedData
        }
        logger.info('--- semseter cluster per block api reponse sent ---');
        res.status(200).send(resultObj);

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;