const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const filter = require('./filter');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- pat exception cluster wise api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        var subject = req.body.subject;
        var start = 8;
        var management = req.body.management;
        var category = req.body.category;
        var report = req.body.report;
        var semester = req.body.semester;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/school_management_category/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/cluster/${grade}.json`
            } else {
                fileName = `exception_list/${report}/school_management_category/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/cluster.json`
            }
        } else {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/cluster/${grade}.json`
            } else {
                fileName = `exception_list/${report}/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/cluster.json`
            }
        }
        var clusterData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var Subjects = [];
        var sortedData;
        if (clusterData) {
            if (grade && grade != 'all') {
                clusterData['data'].map(item => {
                    if (item.subjects) {
                        item.subjects.map(subj => {
                            Object.keys(subj).map(key => {
                                Subjects.push(key);
                            })
                        })
                    }
                });
                Subjects = [...new Set(Subjects)];
            }
            var filteredData = filter.data(clusterData['data'], grade, subject, start, Subjects);
            if (filteredData.length > 0) {
                sortedData = filteredData.sort((a, b) => (a.cluster_name) > (b.cluster_name) ? 1 : -1);
                res.status(200).send({ data: sortedData, footer: clusterData.allClustersFooter.total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
            } else {
                res.status(403).json({ errMsg: "Data not found" });
            }
        } else {
            res.status(403).json({ errMsg: "Data not found" });
        }
        logger.info('--- pat exception cluster wise api response sent---');

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        logger.info('---pat exception clusterperBlock api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        var subject = req.body.subject;
        var start = 8;
        var management = req.body.management;
        var category = req.body.category;
        var report = req.body.report;
        var semester = req.body.semester;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/school_management_category/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/cluster/${grade}.json`
            } else {
                fileName = `exception_list/${report}/school_management_category/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/cluster.json`
            }
        } else {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/cluster/${grade}.json`
            } else {
                fileName = `exception_list/${report}/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/cluster.json`
            }
        }
        var clusterData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;

        let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.district_id == distId && obj.block_id == blockId)
        })
        var Subjects = [];
        var sortedData;
        if (filterData) {
            if (grade && grade != 'all') {
                filterData.map(item => {
                    if (item.subjects) {
                        item.subjects.map(subj => {
                            Object.keys(subj).map(key => {
                                Subjects.push(key);
                            })
                        })
                    }
                });
                Subjects = [...new Set(Subjects)];
            }
            var filteredData = filter.data(filterData, grade, subject, start, Subjects);
            if (filteredData.length > 0) {
                sortedData = filteredData.sort((a, b) => (a.cluster_name) > (b.cluster_name) ? 1 : -1);
                res.status(200).send({ data: sortedData, footer: clusterData.footer[`${blockId}`].total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
            } else {
                res.status(403).json({ errMsg: "Data not found" });
            }
        } else {
            res.status(403).json({ errMsg: "Data not found" });
        }
        logger.info('---pat exception clusterperBlock api response sent---');

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;