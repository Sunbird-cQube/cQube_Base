const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const helper = require('./helper');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT heat map distwise api ---');
        let { year, month, grade, subject_name, exam_date, viewBy } = req.body
        let fileName;
        if (grade == "") {
            fileName = `pat/heatmap-summary/${year}/${month}/allData.json`
        } else {
            if (viewBy == 'indicator') {
                fileName = `pat/heatChart/indicatorIdLevel/${year}/${month}/allData.json`;
            } else if (viewBy == 'question_id')
                fileName = `pat/heatChart/questionIdLevel/${year}/${month}/allData.json`;
        }

        var data = await s3File.readS3File(fileName);
        let districtDetails = data.map(e => {
            return {
                district_id: e.district_id,
                district_name: e.district_name
            }
        })

        districtDetails = districtDetails.reduce((unique, o) => {
            if (!unique.some(obj => obj.district_id === o.district_id)) {
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

        data = data.sort((a, b) => (a.district_name) > (b.district_name) ? 1 : -1)
        let result = await helper.generalFun(grade, data, 0, viewBy)

        logger.info('--- PAT heat map distwise response sent ---');

        res.status(200).send({ districtDetails, result, downloadData: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router