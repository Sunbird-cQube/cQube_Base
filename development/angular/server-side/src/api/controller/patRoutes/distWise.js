const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT dist wise api ---');
        var period = req.body.data.period;
        var grade = req.body.data.grade;
        let fileName;

        var districtData = {}
        if (period == '') {
            if (grade) {
                fileName = `pat/all/district/${grade}.json`
            } else {
                fileName = `pat/all/pat_district.json`
            }
        } else {
            if (grade) {
                fileName = `pat/${period}/district/${grade}.json`
            } else {
                fileName = `pat/${period}/pat_district.json`
            }
        }

        districtData = await s3File.readS3File(fileName);
        var mydata = districtData.data;

        logger.info('--- PAT dist wise api response sent ---');
        res.status(200).send({ data: mydata, footer: districtData.AllDistrictsFooter });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/grades', async (req, res, next) => {
    try {
        logger.info('---grades metadata api ---');
        var fileName;
        var period = req.body.data.period;

        if (period == '' || period == undefined) {
            fileName = `pat/all/pat_metadata.json`;
        } else {
            fileName = `pat/${period}/pat_metadata.json`;
        }

        var data = await s3File.readS3File(fileName);
        logger.info('---grades metadata api response sent---');
        res.status(200).send({ data: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;