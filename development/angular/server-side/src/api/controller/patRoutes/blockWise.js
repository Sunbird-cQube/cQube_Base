const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allBlockWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- all blocks PAT api ---');
        var period = req.body.data.period;
        var grade = req.body.data.grade;
        var report = req.body.data.report;
        var fileName;
        var blockData = {}

        if (period == '') {
            if (grade) {
                fileName = `${report}/all/block/${grade}.json`;
            } else {
                fileName = `${report}/all/${report}_block.json`
            }
        } else {
            if (grade) {
                fileName = `${report}/${period}/block/${grade}.json`;
            } else {
                fileName = `${report}/${period}/${report}_block.json`
            }
        }

        blockData = await s3File.readS3File(fileName);
        var mydata = blockData.data;
        logger.info('--- blocks PAT api response sent---');
        res.status(200).send({ data: mydata, footer: blockData.AllBlocksFooter });

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/blockWise/:distId', auth.authController, async (req, res) => {
    try {
        logger.info('--- block wise PAT api ---');
        var period = req.body.data.period;
        var report = req.body.data.report;
        var fileName;
        if (period == "") {
            fileName = `${report}/all/${report}_block.json`;
        } else {
            fileName = `${report}/${period}/${report}_block.json`;
        }

        var blockData = await s3File.readS3File(fileName);
        let distId = req.params.distId

        let filterData = blockData.data.filter(obj => {
            return (obj.Details.district_id == distId)
        })
        let mydata = filterData;
        logger.info('--- block per dist PAT api response sent---');
        res.status(200).send({ data: mydata, footer: blockData.footer[`${distId}`] });

    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;