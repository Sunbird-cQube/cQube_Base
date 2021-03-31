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
        let fileName;

        if (management != 'overall' && category == 'overall') {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}/school/${grade}.json`
            } else {
                fileName = `exception_list/${report}/school_management_category/${timePeriod}/overall_category/${management}/schools.json`
            }
        } else {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}/school/${grade}.json`
            } else {
                fileName = `exception_list/${report}/${timePeriod}/school.json`
            }
        }
        var schoolData = await s3File.readS3File(fileName);
        var Subjects = [];
        var sortedData;
        if (schoolData) {
            if (grade && grade != 'all') {
                schoolData['data'].map(item => {
                    if (item.subjects) {
                        Object.keys(item.subjects[0]).map(key => {
                            Subjects.push(key);
                        })
                    }
                });
                Subjects = [...new Set(Subjects)];
            }
            var filteredData = filter.data(schoolData['data'], grade, subject, start);
            sortedData = filteredData.sort((a, b) => (a.school_name) > (b.school_name) ? 1 : -1);
        }
        logger.info('--- pat exception school wise api response sent---');
        res.status(200).send({ data: sortedData, footer: schoolData.allSchoolsFooter.total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
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
        let fileName;

        if (management != 'overall' && category == 'overall') {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}/school/${grade}.json`
            } else {
                fileName = `exception_list/${report}/school_management_category/${timePeriod}/overall_category/${management}/schools.json`
            }
        } else {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}/school/${grade}.json`
            } else {
                fileName = `exception_list/${report}/${timePeriod}/school.json`
            }
        }

        var schoolData = await s3File.readS3File(fileName);
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
                        Object.keys(item.subjects[0]).map(key => {
                            Subjects.push(key);
                        })
                    }
                });
                Subjects = [...new Set(Subjects)];
            }
            var filteredData = filter.data(filterData, grade, subject, start);
            sortedData = filteredData.sort((a, b) => (a.school_name) > (b.school_name) ? 1 : -1);
        }
        logger.info('--- pat exception schoolPerCluster api response sent---');
        res.status(200).send({ data: sortedData, footer: schoolData.footer[`${clusterId}`].total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;