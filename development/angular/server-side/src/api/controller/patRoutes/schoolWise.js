const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT school wise api ---');
        var period = req.body.data.period;
        var grade = req.body.data.grade;
        var report = req.body.data.report;
        var semester = req.body.data.sem;
        var academic_year = req.body.data.year;
        var month = req.body.data.month;
        var fileName;
        var schoolData = {}
        if (period == '') {
            if (grade) {
                fileName = `${report}/all/school/${grade}.json`;
            } else {
                fileName = `${report}/all/${report}_school.json`;
            }
        } else {
            if (report == 'pat') {
                if (grade) {
                    if (period != 'select_month') {
                        fileName = `${report}/${period}/school/${grade}.json`;
                    } else {
                        fileName = `${report}/${academic_year}/${month}/school/${grade}.json`;
                    }
                } else {
                    if (period != 'select_month') {
                        fileName = `${report}/${period}/${report}_school.json`;
                    } else {
                        fileName = `${report}/${academic_year}/${month}/school/school.json`;
                    }
                }
            } else {
                if (grade) {
                    fileName = `${report}/${period}/school/${semester}/${grade}.json`;
                } else {
                    fileName = `${report}/${period}/${semester}/${report}_school.json`;
                }
            }
        }
        schoolData = await s3File.readS3File(fileName);
        var mydata = schoolData.data;
        logger.info('---PAT school wise api response sent---');
        // , footer: schoolData.AllSchoolsFooter
        res.status(200).send({ data: mydata });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/schoolWise/:distId/:blockId/:clusterId', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT schoolPerCluster api ---');
        var period = req.body.data.period;
        var report = req.body.data.report;
        var semester = req.body.data.sem;
        var academic_year = req.body.data.year;
        var month = req.body.data.month;
        var fileName;
        if (period == '') {
            fileName = `${report}/all/${report}_school.json`;
        } else {
            if (report == 'pat') {
                if (period != 'select_month') {
                    fileName = `${report}/${period}/${report}_school.json`;
                } else {
                    fileName = `${report}/${academic_year}/${month}/school/school.json`;
                }
            } else {
                fileName = `${report}/${period}/${semester}/${report}_school.json`;
            }
        }

        var schoolData = await s3File.readS3File(fileName);
        let clusterId = req.params.clusterId;

        let filterData = schoolData.data.filter(obj => {
            return (obj.Details.cluster_id == clusterId)
        })
        let mydata = filterData;
        logger.info('---PAT schoolPerCluster api response sent---');
        // , footer: schoolData.footer[`${clusterId}`]
        res.status(200).send({ data: mydata });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;