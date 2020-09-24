const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT dist wise api ---');
        let fileName;

        var districtData = {}
        if (req.body.data) {
            fileName = `pat/district/${req.body.data}.json`
            districtData = await s3File.readS3File(fileName);
        } else {
            fileName = `pat/pat_district.json`
            districtData = await s3File.readS3File(fileName);
        }
        var mydata = districtData.data;

        logger.info('--- PAT dist wise api response sent ---');
        res.status(200).send({ data: mydata, footer: districtData.AllDistrictsFooter });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.get('/grades', async (req, res, next) => {
    try {
        logger.info('---grades metadata api ---');
        let fileName = `pat/pat_metadata.json`
        var data = await s3File.readS3File(fileName);
        // console.log(data);
        logger.info('---grades metadata api response sent---');
        res.status(200).send({ data: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;