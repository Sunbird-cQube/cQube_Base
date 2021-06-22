const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const filter = require('./filter');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- pat exception school wise api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        var subject = req.body.subject;
        var start = 10;
        var management = req.body.management;
        var category = req.body.category;
        var report = req.body.report;
        var semester = req.body.semester;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/school_management_category/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/school/${grade}.json`
            } else {
                fileName = `exception_list/${report}/school_management_category/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/${report == 'sat_exception' || report == 'pat_exception' ? 'school' : 'schools'}.json`;
            }
        } else {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/school/${grade}.json`
            } else {
                fileName = `exception_list/${report}/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/school.json`
            }
        }
        var schoolData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var Subjects = [];
        var sortedData;
        if (schoolData) {
            if (grade && grade != 'all') {
                schoolData['data'].map(item => {
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
            var filteredData = filter.data(schoolData['data'], grade, subject, start, Subjects);
            if (filteredData.length > 0) {
                sortedData = filteredData.sort((a, b) => (a.school_name) > (b.school_name) ? 1 : -1);
                res.status(200).send({ data: sortedData, footer: schoolData.allSchoolsFooter.total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
            } else {
                res.status(403).json({ errMsg: "Data not found" });
            }
        } else {
            res.status(403).json({ errMsg: "Data not found" });
        }
        logger.info('--- pat exception school wise api response sent---');
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('--- pat exception schoolPerCluster api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        var subject = req.body.subject;
        var start = 10;
        var management = req.body.management;
        var category = req.body.category;
        var report = req.body.report;
        var semester = req.body.semester;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/school_management_category/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/school/${grade}.json`
            } else {
                fileName = `exception_list/${report}/school_management_category/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/${report == 'sat_exception' || report == 'pat_exception' ? 'school' : 'schools'}.json`;
            }
        } else {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/school/${grade}.json`
            } else {
                fileName = `exception_list/${report}/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/school.json`
            }
        }
        var schoolData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        let distId = req.params.distId;
        let blockId = req.params.blockId;
        let clusterId = req.params.clusterId;

        let filterData = schoolData.data.filter(obj => {
            return (obj.district_id == distId && obj.block_id == blockId && parseInt(obj.cluster_id) == clusterId)
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
                sortedData = filteredData.sort((a, b) => (a.school_name) > (b.school_name) ? 1 : -1);
                res.status(200).send({ data: sortedData, footer: schoolData.footer[`${clusterId}`].total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
            } else {
                res.status(403).json({ errMsg: "Data not found" });
            }
        } else {
            res.status(403).json({ errMsg: "Data not found" });
        }
        logger.info('--- pat exception schoolPerCluster api response sent---');
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;