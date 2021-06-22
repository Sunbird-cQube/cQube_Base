const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const helper = require('./helper');

router.post('/blockWise', auth.authController, async (req, res) => {
    try {
        logger.info(`--- ${req.body.report} heat map block wise api ---`);
        let { year, month, grade, subject_name, exam_date, districtId, viewBy, report, management, category } = req.body
        let fileName = ''

        if (management != 'overall' && category == 'overall') {
            if (grade == "") {
                fileName = `${report}/school_management_category/heatmap-summary/${year}/${month}/overall_category/${management}/districts/${districtId}.json`
            } else {
                if (viewBy == 'indicator') {
                    fileName = `${report}/school_management_category/heatChart/indicatorIdLevel/${year}/${month}/overall_category/${management}/districts/${districtId}.json`;
                } else if (viewBy == 'question_id')
                    fileName = `${report}/school_management_category/heatChart/questionIdLevel/${year}/${month}/overall_category/${management}/districts/${districtId}.json`;
            }
        } else {
            if (grade == "") {
                fileName = `${report}/heatmap-summary/${year}/${month}/districts/${districtId}.json`;
            } else {
                if (viewBy == 'indicator') {
                    fileName = `${report}/heatChart/indicatorIdLevel/${year}/${month}/districts/${districtId}.json`;
                } else if (viewBy == 'question_id')
                    fileName = `${report}/heatChart/questionIdLevel/${year}/${month}/districts/${districtId}.json`;
            }
        }

        var data = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        if (districtId) {
            data = data.filter(val => {
                return val.district_id == districtId
            })
        }

        let blockDetails = data.map(e => {
            return {
                district_id: e.district_id,
                district_name: e.district_name,
                block_id: e.block_id,
                block_name: e.block_name
            }
        })

        blockDetails = blockDetails.reduce((unique, o) => {
            if (!unique.some(obj => obj.block_id === o.block_id)) {
                unique.push(o);
            }
            return unique;
        }, []);

        if (grade) {
            data = data.filter(val => {
                return val.grade == grade
            })
        }
        if (subject_name) {
            data = data.filter(val => {
                return val.subject_name == subject_name
            })
        }
        if (exam_date) {
            data = data.filter(val => {
                return val.exam_date == exam_date
            })
        }
        // res.send(data)
        data = data.sort((a, b) => (a.block_name) > (b.block_name) ? 1 : -1)
        let result = await helper.generalFun(grade, data, 1, viewBy)

        logger.info(`--- ${req.body.report} heat map block wise response sent ---`);
        res.status(200).send({ blockDetails, result, downloadData: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router