const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT school wise api ---');
        var period = req.body.data.period;
        var grade = req.body.data.grade;
        var fileName;
        var schoolData = {}
        if (period == '') {
            if (grade) {
                fileName = `pat/all/school/${grade}.json`;
            } else {
                fileName = `pat/all/pat_school.json`;
            }
        } else {
            if (grade) {
                fileName = `pat/${period}/school/${grade}.json`;
            } else {
                fileName = `pat/${period}/pat_school.json`;
            }
        }
        schoolData = await s3File.readS3File(fileName);
        var mydata = schoolData.data;
        logger.info('---PAT school wise api response sent---');
        res.status(200).send({ data: mydata, footer: schoolData.AllSchoolsFooter });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT schoolPerCluster api ---');
        var period = req.body.data.period;
        var fileName;
        if (period == '') {
            fileName = `pat/all/pat_school.json`;
        } else {
            fileName = `pat/${period}/pat_school.json`;
        }

        var schoolData = await s3File.readS3File(fileName);
        let clusterId = req.params.clusterId;

        let filterData = schoolData.data.filter(obj => {
            return (obj.Details.cluster_id == clusterId)
        })
        let mydata = filterData;
        logger.info('---PAT schoolPerCluster api response sent---');
        res.status(200).send({ data: mydata, footer: schoolData.footer[`${clusterId}`] });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;