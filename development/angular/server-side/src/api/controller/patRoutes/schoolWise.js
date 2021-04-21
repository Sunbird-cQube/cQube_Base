const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allSchoolWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT school wise api ---');
        var period = req.body.data.period;
        var grade = req.body.data.grade;
        var subject = req.body.data.subject;
        var report = req.body.data.report;
        var semester = req.body.data.sem;
        var academic_year = req.body.data.year;
        var month = req.body.data.month;
        var management = req.body.data.management;
        var category = req.body.data.category;
        var fileName;
        var schoolData = {}
        var footerFile;
        var footerData = {}


        if (management != 'overall' && category == 'overall') {
            if (report == 'pat') {
                if (grade) {
                    if (period != 'select_month') {
                        fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/school/${grade}.json`;
                    } else {
                        fileName = `${report}/${academic_year}/${month}/school/${grade}.json`;
                    }
                } else {
                    if (period != 'select_month') {
                        fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/school.json`;
                    } else {
                        fileName = `${report}/school_management_category/${academic_year}/${month}/overall_category/${management}/school.json`;
                    }
                }
            } else {
                if (grade) {
                    fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/${semester}/overall_category/${management}/school/${grade}.json`;
                } else {
                    fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/${semester}/overall_category/${management}/school.json`;
                }
            }
        } else {
            if (report == 'pat') {
                if (grade) {
                    if (period != 'select_month') {
                        fileName = `${report}/${period}/school/${grade}.json`;
                        if (subject) {
                            footerFile = `pat/${period == 'all' ? 'overall' : period}/all_subjects_footer.json`
                        }
                    } else {
                        fileName = `${report}/${academic_year}/${month}/school/${grade}.json`;
                        if (subject) {
                            footerFile = `pat/${academic_year}/${month}/all_subjects_footer.json`
                        }
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
                    if (subject) {
                        footerFile = `sat/${period}/${semester}/all_subjects_footer.json`;
                    }
                } else {
                    fileName = `${report}/${period}/${semester}/${report}_school.json`;
                }
            }
        }
        schoolData = await s3File.readS3File(fileName);
        var footer;
        if (subject)
            footerData = await s3File.readS3File(footerFile);
        if (grade && !subject || !grade && !subject) {
            footer = schoolData['AllSchoolsFooter'];
        } else {
            footerData.map(foot => {
                footer = foot.subjects[`${subject}`]
            })
        }
        var mydata = schoolData.data;
        logger.info('---PAT school wise api response sent---');
        // , footer: schoolData.AllSchoolsFooter
        res.status(200).send({ data: mydata, footer: footer });
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
        var management = req.body.data.management;
        var category = req.body.data.category;
        var grad = req.body.data.grade;
        var subject = req.body.data.subject;
        var fileName;
        let footerFile;
        var footerData = {}

        if (management != 'overall' && category == 'overall') {
            if (report == 'pat') {
                if (period != 'select_month') {
                    fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/school.json`;
                    footerFile = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/cluster/grade_subject_footer.json`;
                } else {
                    fileName = `${report}/school_management_category/${academic_year}/${month}/overall_category/${management}/school.json`;
                    footerFile = `${report}/school_management_category/${academic_year}/${month}/overall_category/${management}/cluster/grade_subject_footer.json`;
                }
            } else {
                fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/${semester}/overall_category/${management}/school.json`;
            }
        } else {
            if (report == 'pat') {
                if (period != 'select_month') {
                    fileName = `${report}/${period}/${report}_school.json`;
                    footerFile = `${report}/${period}/cluster/grade_subject_footer.json`;
                } else {
                    fileName = `${report}/${academic_year}/${month}/school/school.json`;
                    footerFile = `${report}/${academic_year}/${month}/cluster/grade_subject_footer.json`;
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

        var grades = [];
        filterData.map(item => {
            Object.keys(item.Grades).map(grade => {
                grades.push(grade);
            })
        });

        var uniqueGrades = [];
        [...new Set(grades)].map(grade => {
            uniqueGrades.push({ grade: grade });
        })
        uniqueGrades = uniqueGrades.sort((a, b) => a.grade > b.grade ? 1 : -1);
        let mydata = filterData;
        var footer;
        if (grad)
            footerData = await s3File.readS3File(footerFile);
        if (grad && !subject) {
            footer = footerData[clusterId][grad];
        } else if (grad && subject) {
            footer = footerData[clusterId][grad].subject[subject];
        } else {
            footer = schoolData['footer'][clusterId]
        }
        logger.info('---PAT schoolPerCluster api response sent---');
        res.status(200).send({ data: mydata, grades: uniqueGrades, footer: footer });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;