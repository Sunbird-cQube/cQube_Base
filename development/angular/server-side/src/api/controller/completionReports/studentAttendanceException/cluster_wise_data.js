const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/clusterWise', auth.authController, async (req, res) => {
    try {
        logger.info(`---${req.body.report} cluster wise api ---`);
        var month = req.body.month;
        var year = req.body.year;
        var timePeriod = req.body.period;
        var report = req.body.report;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (report == 'sarException') {
            if (management != 'overall' && category == 'overall') {
                if (timePeriod != null) {
                    fileName = `exception_list/student_attendance_completion/school_management_category/${timePeriod}/overall_category/${management}/cluster.json`;
                } else {
                    fileName = `exception_list/student_attendance_completion/school_management_category/overall_category/${management}/cluster_${year}_${month}.json`;
                }
            } else {
                if (timePeriod != null) {
                    fileName = `exception_list/student_attendance_completion/${timePeriod}/cluster.json`;
                } else {
                    fileName = `exception_list/student_attendance_completion/cluster_${year}_${month}.json`;
                }
            }
        } else {
            if (management != 'overall' && category == 'overall') {
                if (timePeriod != null) {
                    fileName = `exception_list/teacher_attendance_completion/school_management_category/${timePeriod}/overall_category/${management}/cluster.json`;
                } else {
                    fileName = `exception_list/teacher_attendance_completion/school_management_category/overall_category/${management}/cluster_${year}_${month}.json`;
                }
            } else {
                if (timePeriod != null) {
                    fileName = `exception_list/teacher_attendance_completion/${timePeriod}/cluster.json`;
                } else {
                    fileName = `exception_list/teacher_attendance_completion/cluster_${year}_${month}.json`;
                }
            }
        }
        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var clustersAttendanceData = jsonData.data
        var dateRange = `${clustersAttendanceData[0]['data_from_date']} to ${clustersAttendanceData[0]['data_upto_date']}`;
        var clusterData = [];
        for (let i = 0; i < clustersAttendanceData.length; i++) {
            var obj = {
                cluster_id: clustersAttendanceData[i]['cluster_id'],
                cluster_name: clustersAttendanceData[i]['cluster_name'],
                block_id: clustersAttendanceData[i]['block_id'],
                block_name: clustersAttendanceData[i]['block_name'],
                district_id: clustersAttendanceData[i]['district_id'],
                district_name: clustersAttendanceData[i]['district_name'],
                attendance: clustersAttendanceData[i]['x_value'],
                lat: clustersAttendanceData[i]['cluster_latitude'],
                lng: clustersAttendanceData[i]['cluster_longitude'],
                total_schools_with_missing_data: (clustersAttendanceData[i]['total_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                total_number_of_schools: (clustersAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                percentage_schools_with_missing_data: (clustersAttendanceData[i]['percentage_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            clusterData.push(obj);
        }
        logger.info(`---${req.body.report} cluster wise api response sent ---`);
        res.status(200).send({ clusterData: clusterData, missingSchoolsCount: jsonData.allClustersFooter.total_schools_with_missing_data, dateRange: dateRange });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterPerBlock', auth.authController, async (req, res) => {
    try {
        logger.info(`---${req.body.report} clusterPerBlock api ---`);
        var blockId = req.body.id;
        var month = req.body.month;
        var year = req.body.year;
        var timePeriod = req.body.period;
        var report = req.body.report;
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (report == 'sarException') {
            if (management != 'overall' && category == 'overall') {
                if (timePeriod != null) {
                    fileName = `exception_list/student_attendance_completion/school_management_category/${timePeriod}/overall_category/${management}/cluster.json`;
                } else {
                    fileName = `exception_list/student_attendance_completion/school_management_category/overall_category/${management}/cluster_${year}_${month}.json`;
                }
            } else {
                if (timePeriod != null) {
                    fileName = `exception_list/student_attendance_completion/${timePeriod}/cluster.json`;
                } else {
                    fileName = `exception_list/student_attendance_completion/cluster_${year}_${month}.json`;
                }
            }
        } else {
            if (management != 'overall' && category == 'overall') {
                if (timePeriod != null) {
                    fileName = `exception_list/teacher_attendance_completion/school_management_category/${timePeriod}/overall_category/${management}/cluster.json`;
                } else {
                    fileName = `exception_list/teacher_attendance_completion/school_management_category/overall_category/${management}/cluster_${year}_${month}.json`;
                }
            } else {
                if (timePeriod != null) {
                    fileName = `exception_list/teacher_attendance_completion/${timePeriod}/cluster.json`;
                } else {
                    fileName = `exception_list/teacher_attendance_completion/cluster_${year}_${month}.json`;
                }
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
                cluster_id: clustersAttendanceData[i]['cluster_id'],
                cluster_name: clustersAttendanceData[i]['cluster_name'],
                block_id: clustersAttendanceData[i]['block_id'],
                block_name: clustersAttendanceData[i]['block_name'],
                district_id: clustersAttendanceData[i]['district_id'],
                district_name: clustersAttendanceData[i]['district_name'],
                attendance: clustersAttendanceData[i]['x_value'],
                lat: clustersAttendanceData[i]['cluster_latitude'],
                lng: clustersAttendanceData[i]['cluster_longitude'],
                total_schools_with_missing_data: (clustersAttendanceData[i]['total_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                total_number_of_schools: (clustersAttendanceData[i]['total_schools']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                percentage_schools_with_missing_data: (clustersAttendanceData[i]['percentage_schools_with_missing_data']).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
            }
            clusterData.push(obj);
        }
        logger.info(`---${req.body.report} clusterPerBlock api response sent ---`);
        res.status(200).send({ clusterDetails: clusterData, missingSchoolsCount: jsonData.footer[blockId].total_schools_with_missing_data, dateRange: dateRange });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;