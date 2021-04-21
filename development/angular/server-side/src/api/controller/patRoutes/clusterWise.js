const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT cluster wise api ---');
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
        var clusterData = {}
        var footerFile;
        var footerData = {}

        if (management != 'overall' && category == 'overall') {
            if (report == 'pat') {
                if (grade) {
                    if (period != 'select_month') {
                        fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/cluster/${grade}.json`;
                    } else {
                        fileName = `${report}/${academic_year}/${month}/cluster/${grade}.json`;
                    }
                } else {
                    if (period != 'select_month') {
                        fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/cluster.json`;
                    } else {
                        fileName = `${report}/school_management_category/${academic_year}/${month}/overall_category/${management}/cluster.json`;
                    }
                }
            } else {
                if (grade) {
                    fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/${semester}/overall_category/${management}/cluster/${grade}.json`;
                } else {
                    fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/${semester}/overall_category/${management}/cluster.json`;
                }
            }
        } else {
            if (report == 'pat') {
                if (grade) {
                    if (period != 'select_month') {
                        fileName = `${report}/${period}/cluster/${grade}.json`;
                        if (subject) {
                            footerFile = `pat/${period == 'all' ? 'overall' : period}/all_subjects_footer.json`
                        }
                    } else {
                        fileName = `${report}/${academic_year}/${month}/cluster/${grade}.json`;
                        if (subject) {
                            footerFile = `pat/${academic_year}/${month}/all_subjects_footer.json`
                        }
                    }
                } else {
                    if (period != 'select_month') {
                        fileName = `${report}/${period}/${report}_cluster.json`;
                    } else {
                        fileName = `${report}/${academic_year}/${month}/cluster/cluster.json`;
                    }
                }
            } else {
                if (grade) {
                    fileName = `${report}/${period}/cluster/${semester}/${grade}.json`;
                    if (subject) {
                        footerFile = `sat/${period}/${semester}/all_subjects_footer.json`;
                    }
                } else {
                    fileName = `${report}/${period}/${semester}/${report}_cluster.json`;
                }
            }
        }

        clusterData = await s3File.readS3File(fileName);
        var footer;
        if (subject)
            footerData = await s3File.readS3File(footerFile);
        if (grade && !subject || !grade && !subject) {
            footer = clusterData['AllClustersFooter'];
        } else {
            footerData.map(foot => {
                footer = foot.subjects[`${subject}`]
            })
        }
        var mydata = clusterData.data;
        logger.info('---PAT cluster wise api response sent---');
        // , footer: clusterData.AllClustersFooter
        res.status(200).send({ data: mydata, footer: footer });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT clusterperBlock api ---');
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
                    fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/cluster.json`;
                    footerFile = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/block/grade_subject_footer.json`;
                } else {
                    fileName = `${report}/school_management_category/${academic_year}/${month}/overall_category/${management}/cluster.json`;
                    footerFile = `${report}/school_management_category/${academic_year}/${month}/overall_category/${management}/block/grade_subject_footer.json`;
                }
            } else {
                fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/${semester}/overall_category/${management}/cluster.json`;
            }
        } else {
            if (report == 'pat') {
                if (period != 'select_month') {
                    fileName = `${report}/${period}/${report}_cluster.json`;
                    footerFile = `${report}/${period}/block/grade_subject_footer.json`;
                } else {
                    fileName = `${report}/${academic_year}/${month}/cluster/cluster.json`;
                    footerFile = `${report}/${academic_year}/${month}/block/grade_subject_footer.json`;
                }
            } else {
                fileName = `${report}/${period}/${semester}/${report}_cluster.json`;
                footerFile = `${report}/${period}/block/grade_subject_footer.json`;
            }
        }
        var clusterData = await s3File.readS3File(fileName);

        let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.Details.district_id == distId && obj.Details.block_id == blockId)
        });
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
            footer = footerData[blockId][grad];
        } else if (grad && subject) {
            footer = footerData[blockId][grad].subject[subject];
        } else {
            footer = clusterData['footer'][blockId]
        }

        logger.info('---PAT clusterperBlock api response sent---');
        res.status(200).send({ data: mydata, grades: uniqueGrades, footer: footer });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;