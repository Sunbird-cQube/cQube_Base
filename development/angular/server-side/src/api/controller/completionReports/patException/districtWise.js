const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const filter = require('./filter');

router.post('/allDistrictWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- pat exception district api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        var subject = req.body.subject;
        var start = 4;
        var management = req.body.management;
        var category = req.body.category;
        var report = req.body.report;
        var semester = req.body.semester;
        let fileName;

        if (management != 'overall' && category == 'overall') {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/school_management_category/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/district/${grade}.json`
            } else {
                fileName = `exception_list/${report}/school_management_category/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/overall_category/${management}/district.json`
            }
        } else {
            if (grade && grade != 'all') {
                fileName = `exception_list/${report}/grade/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/district/${grade}.json`
            } else {
                fileName = `exception_list/${report}/${timePeriod}${report == 'sat_exception' ? '/' + semester : ''}/district.json`
            }
        }
        var districtData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var Subjects = [];
        var sortedData;
        if (districtData) {
            if (grade && grade != 'all') {
                districtData['data'].map(item => {
                    item.subjects.map(subj => {
                        Object.keys(subj).map(key => {
                            Subjects.push(key);
                        })
                    })
                });
                Subjects = [...new Set(Subjects)];
            }
            var filteredData = filter.data(districtData['data'], grade, subject, start, Subjects);
            if (filteredData.length > 0) {
                sortedData = filteredData.sort((a, b) => (a.district_name) > (b.district_name) ? 1 : -1);
                logger.info('--- pat exception district api response sent ---');
                res.status(200).send({ data: sortedData, footer: districtData.allDistrictsFooter.total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });

            } else {
                logger.info('--- pat exception district api response sent ---');
                res.status(403).json({ errMsg: "Data not found" });
            }
        } else {
            logger.info('--- pat exception district api response sent ---');
            res.status(403).json({ errMsg: "Data not found" });
        }

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/grades', async (req, res, next) => {
    try {
        logger.info('---grades metadata api ---');
        var fileName;
        var period = req.body.period;
        var report = req.body.report;

        if (report == 'pat_exception') {
            if (period == 'overall' || period == undefined) {
                fileName = `pat/all/pat_metadata.json`;
            } else {
                fileName = `pat/${period}/pat_metadata.json`;
            }
        } else {
            if (period == 'overall' || period == undefined) {
                fileName = `sat/all/sat_metadata.json`;
            } else {
                fileName = `sat/${period}/sat_metadata.json`;
            }
        }

        var data = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        logger.info('---grades metadata api response sent---');
        res.status(200).send({ data: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/getSemesters', async (req, res) => {
    try {
        logger.info('---sat metadata api ---');
        var fileName;
        var period = req.body.period;
        if (period != 'overall') {
            fileName = `sat/${period}/sat_semester_metadata.json`;
        } else {
            fileName = `sat/all/sat_semester_metadata.json`;
        }
        var data = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        logger.info('---sat metadata api response sent---');
        res.status(200).send({ data: data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router