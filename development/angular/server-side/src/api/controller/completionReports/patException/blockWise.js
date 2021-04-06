const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const filter = require('./filter');

router.post('/allBlockWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- all blocks pat exception api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        var subject = req.body.subject;
        var start = 6;
        var management = req.body.management;
        var category = req.body.category;
        var report = req.body.report;
        var semester = req.body.semester;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/school_management_category/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/block/${grade}.json`
            } else {
                fileName = `exception_list/${report}/school_management_category/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/block.json`
            }
        } else {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/block/${grade}.json`
            } else {
                fileName = `exception_list/${report}/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/block.json`
            }
        }
        var blockData = await s3File.readS3File(fileName);
        var Subjects = [];
        var sortedData;
        if (blockData) {
            if (grade && grade != 'all') {
                blockData['data'].map(item => {
                    Object.keys(item.subjects[0]).map(key => {
                        Subjects.push(key);
                    })
                });
                Subjects = [...new Set(Subjects)];
            }
            var filteredData = filter.data(blockData['data'], grade, subject, start);
            sortedData = filteredData.sort((a, b) => (a.block_name) > (b.block_name) ? 1 : -1);
        }
        logger.info('--- blocks pat exception api response sent---');
        res.status(200).send({ data: sortedData, footer: blockData.allBlocksFooter.total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/blockWise/:distId', auth.authController, async (req, res) => {
    try {
        logger.info('--- block per district pat exception api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        var subject = req.body.subject;
        var start = 6;
        var management = req.body.management;
        var category = req.body.category;
        var report = req.body.report;
        var semester = req.body.semester;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/school_management_category/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/block/${grade}.json`
            } else {
                fileName = `exception_list/${report}/school_management_category/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/block.json`
            }
        } else {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/block/${grade}.json`
            } else {
                fileName = `exception_list/${report}/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/block.json`
            }
        }
        var blockData = await s3File.readS3File(fileName);
        let distId = req.params.distId
        let filterData = blockData.data.filter(obj => {
            return (obj.district_id == distId)
        })
        var Subjects = [];
        var sortedData;
        if (filterData) {
            if (grade && grade != 'all') {
                filterData.map(item => {
                    Object.keys(item.subjects[0]).map(key => {
                        Subjects.push(key);
                    })
                });
                Subjects = [...new Set(Subjects)];
            }
            var filteredData = filter.data(filterData, grade, subject, start);
            sortedData = filteredData.sort((a, b) => (a.block_name) > (b.block_name) ? 1 : -1);
        }
        logger.info('--- block per district pat exception api response sent---');
        res.status(200).send({ data: sortedData, footer: blockData.footer[`${distId}`].total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;