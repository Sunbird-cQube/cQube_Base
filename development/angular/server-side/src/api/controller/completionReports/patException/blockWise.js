const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allBlockWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- all blocks pat exception api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        let fileName;
        if (grade && grade != 'all') {
            fileName = `exception_list/pat_exception/grade/${timePeriod}/block/${grade}.json`
        } else {
            fileName = `exception_list/pat_exception/${timePeriod}/block.json`
        }
        var blockData = await s3File.readS3File(fileName);
        var Subjects = [];
        var sortedData;
        if (blockData) {
            sortedData = blockData['data'].sort((a, b) => (a.block_name) > (b.block_name) ? 1 : -1);
            if (grade && grade != 'all') {
                sortedData.map(item => {
                    Object.keys(item.subjects[0]).map(key => {
                        Subjects.push(key);
                    })
                });
                Subjects = [...new Set(Subjects)];
            }
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
        let fileName;
        if (grade && grade != 'all') {
            fileName = `exception_list/pat_exception/grade/${timePeriod}/block/${grade}.json`
        } else {
            fileName = `exception_list/pat_exception/${timePeriod}/block.json`
        }
        var blockData = await s3File.readS3File(fileName);
        let distId = req.params.distId
        let filterData = blockData.data.filter(obj => {
            return (obj.district_id == distId)
        })
        var Subjects = [];
        var sortedData;
        if (filterData) {
            sortedData = filterData.sort((a, b) => (a.block_name) > (b.block_name) ? 1 : -1);
            if (grade && grade != 'all') {
                sortedData.map(item => {
                    Object.keys(item.subjects[0]).map(key => {
                        Subjects.push(key);
                    })
                });
                Subjects = [...new Set(Subjects)];
            }
        }
        logger.info('--- block per district pat exception api response sent---');
        res.status(200).send({ data: sortedData, footer: blockData.footer[`${distId}`].total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;