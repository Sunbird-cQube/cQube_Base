const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT dist wise api ---');
        var period = req.body.data.period;
        var grade = req.body.data.grade;
        var report = req.body.data.report;
        var semester = req.body.data.sem;
        var academic_year = req.body.data.year;
        var month = req.body.data.month;
        var management = req.body.data.management;
        var category = req.body.data.category;
        let fileName;
        var districtData = {}
        // if (management != 'overall' && category != 'overall') {

        // } else if (management == 'overall' && category != 'overall') {

        // } else
        if (management != 'overall' && category == 'overall') {
            if (report == 'pat') {
                if (grade) {
                    if (period != 'select_month') {
                        fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/district/${grade}.json`;
                    } else {
                        fileName = `${report}/school_management_category/overall/overall_category/${academic_year}/${month}/district/${grade}.json`;
                    }
                } else {
                    if (period != 'select_month') {
                        fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/district.json`;
                    } else {
                        fileName = `${report}/school_management_category/${academic_year}/${month}/overall_category/${management}/district.json`;
                    }
                }
            } else {
                if (grade) {
                    fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/${semester}/overall_category/${management}/district/${grade}.json`;
                } else {
                    fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/${semester}/overall_category/${management}/district.json`;
                }
            }
        } else {
            if (report == 'pat') {
                if (grade) {
                    if (period != 'select_month') {
                        fileName = `${report}/${period}/district/${grade}.json`;
                    } else {
                        fileName = `${report}/${academic_year}/${month}/district/${grade}.json`;
                    }
                } else {
                    if (period != 'select_month') {
                        fileName = `${report}/${period}/${report}_district.json`;
                    } else {
                        fileName = `${report}/${academic_year}/${month}/district/district.json`;
                    }
                }
            } else {
                if (grade) {
                    fileName = `${report}/${period}/district/${semester}/${grade}.json`;
                } else {
                    fileName = `${report}/${period}/${semester}/${report}_district.json`;
                }
            }
        }

        districtData = await s3File.readS3File(fileName);
        // console.log(districtData.data[0]);
        var mydata = districtData.data;
        logger.info('--- PAT dist wise api response sent ---');
        res.status(200).send({ data: mydata, footer: districtData['AllDistrictsFooter'] });
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
        var report = req.body.data.report;
        var academic_year = req.body.data.year;
        var month = req.body.data.month;

        if (period == 'select_month' || period == null) {
            if (academic_year && month) {
                fileName = `${report}/${academic_year}/${month}/metaData.json`;
            } else {
                fileName = `${report}/all/${report}_metadata.json`;
            }
        } else {
            fileName = `${report}/${period}/${report}_metadata.json`;
        }
        var data = await s3File.readS3File(fileName);
        logger.info('---grades metadata api response sent---');
        res.status(200).send({ data: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/getSemesters', async (req, res, next) => {
    try {
        logger.info('---semester metadata api ---');
        var fileName;
        var period = req.body.period;
        if (period != 'select_month')
            fileName = `sat/${period}/sat_semester_metadata.json`;

        var data = await s3File.readS3File(fileName);
        logger.info('---semester metadata api response sent---');
        res.status(200).send({ data: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;