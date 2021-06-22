const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/clusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Attendance cluster wise api ---');
        var month = req.body.month;
        var year = req.body.year;
        var timePeriod = req.body.period;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category != 'overall') {
            if (timePeriod != null) {
                fileName = `teacher_attendance/${timePeriod}/school_management_category/${management}/${category}/cluster.json`;
            } else {
                fileName = `teacher_attendance/school_management_category/${management}/${category}/cluster_${year}_${month}.json`;
            }
        } else if (management == 'overall' && category != 'overall') {
            if (timePeriod != null) {
                fileName = `teacher_attendance/${timePeriod}/school_management_category/overall_management/${category}/cluster.json`;
            } else {
                fileName = `teacher_attendance/school_management_category/${year}/${month}/overall_management${category}/cluster.json`;
            }
        } else if (management != 'overall' && category == 'overall') {
            if (timePeriod != null) {
                fileName = `teacher_attendance/${timePeriod}/school_management_category/overall_category/${management}/cluster.json`;
            } else {
                fileName = `teacher_attendance/school_management_category/${year}/${month}/overall_category/${management}/cluster.json`;
            }
        } else {
            if (timePeriod != null) {
                fileName = `teacher_attendance/${timePeriod}/cluster.json`;
            } else {
                fileName = `teacher_attendance/cluster_${year}_${month}.json`;
            }
        }
        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var clustersAttendanceData = jsonData.data;
        var dateRange = `${clustersAttendanceData[0]['data_from_date']} to ${clustersAttendanceData[0]['data_upto_date']}`;
        var clusterData = [];
        for (let i = 0; i < clustersAttendanceData.length; i++) {
            var obj = {
                cluster_id: clustersAttendanceData[i]['x_axis'],
                cluster_name: clustersAttendanceData[i]['cluster_name'],
                block_id: clustersAttendanceData[i]['block_id'],
                block_name: clustersAttendanceData[i]['block_name'],
                district_id: clustersAttendanceData[i]['district_id'],
                district_name: clustersAttendanceData[i]['district_name'],
                attendance: clustersAttendanceData[i]['x_value'],
                lat: clustersAttendanceData[i]['y_value'],
                lng: clustersAttendanceData[i]['z_value'],
                number_of_teachers: clustersAttendanceData[i]['teachers_count'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                number_of_schools: (clustersAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            }
            clusterData.push(obj);
        }
        logger.info('--- Attendance cluster wise api response sent ---');
        res.status(200).send({ clusterData: clusterData, teacherCount: jsonData.allClustersFooter.teachers, schoolCount: jsonData.allClustersFooter.schools, dateRange: dateRange });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterPerBlock', auth.authController, async (req, res) => {
    try {
        logger.info('---Attendance clusterPerBlock api ---');
        var blockId = req.body.id;
        var month = req.body.month;
        var year = req.body.year;
        var timePeriod = req.body.period;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category != 'overall') {
            if (timePeriod != null) {
                fileName = `teacher_attendance/${timePeriod}/school_management_category/${management}/${category}/cluster.json`;
            } else {
                fileName = `teacher_attendance/school_management_category/${management}/${category}/cluster_${year}_${month}.json`;
            }
        } else if (management == 'overall' && category != 'overall') {
            if (timePeriod != null) {
                fileName = `teacher_attendance/${timePeriod}/school_management_category/overall_management/${category}/cluster.json`;
            } else {
                fileName = `teacher_attendance/school_management_category/${year}/${month}/overall_management${category}/cluster.json`;
            }
        } else if (management != 'overall' && category == 'overall') {
            if (timePeriod != null) {
                fileName = `teacher_attendance/${timePeriod}/school_management_category/overall_category/${management}/cluster.json`;
            } else {
                fileName = `teacher_attendance/school_management_category/${year}/${month}/overall_category/${management}/cluster.json`;
            }
        } else {
            if (timePeriod != null) {
                fileName = `teacher_attendance/${timePeriod}/cluster.json`;
            } else {
                fileName = `teacher_attendance/cluster_${year}_${month}.json`;
            }
        }
        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var clusterData = [];
        var filterData = jsonData.data.filter(data => {
            return (data.block_id == blockId)
        });
        var clustersAttendanceData = filterData;
        var dateRange = `${clustersAttendanceData[0]['data_from_date']} to ${clustersAttendanceData[0]['data_upto_date']}`;
        for (let i = 0; i < clustersAttendanceData.length; i++) {
            var obj = {
                cluster_id: clustersAttendanceData[i]['x_axis'],
                cluster_name: clustersAttendanceData[i]['cluster_name'],
                block_id: clustersAttendanceData[i]['block_id'],
                block_name: clustersAttendanceData[i]['block_name'],
                district_id: clustersAttendanceData[i]['district_id'],
                district_name: clustersAttendanceData[i]['district_name'],
                attendance: clustersAttendanceData[i]['x_value'],
                lat: clustersAttendanceData[i]['y_value'],
                lng: clustersAttendanceData[i]['z_value'],
                number_of_teachers: clustersAttendanceData[i]['teachers_count'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                number_of_schools: (clustersAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            }
            clusterData.push(obj);
        }
        logger.info('--- Attendance clusterPerDist api response sent ---');
        res.status(200).send({ clusterDetails: clusterData, teacherCount: jsonData.footer[blockId].teachers, schoolCount: jsonData.footer[blockId].schools, dateRange: dateRange });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;