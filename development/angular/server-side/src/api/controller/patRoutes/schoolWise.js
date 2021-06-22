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
                        if (subject) {
                            footerFile = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/all_subjects_footer.json`
                        }
                    } else {
                        fileName = `${report}/school_management_category/${academic_year}/${month}/overall_category/${management}/school/${grade}.json`;
                        if (subject) {
                            footerFile = `${report}/school_management_category/${academic_year}/${month}/overall_category/${management}/all_subjects_footer.json`
                        }
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
                    if (subject) {
                        footerFile = `${report}/school_management_category/${period}/${semester}/overall_category/${management}/all_subjects_footer.json`;
                    }
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
                            footerFile = `${report}/${period == 'all' ? 'overall' : period}/all_subjects_footer.json`
                        }
                    } else {
                        fileName = `${report}/${academic_year}/${month}/school/${grade}.json`;
                        if (subject) {
                            footerFile = `${report}/${academic_year}/${month}/all_subjects_footer.json`
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
                        footerFile = `${report}/${period}/${semester}/all_subjects_footer.json`;
                    }
                } else {
                    fileName = `${report}/${period}/${semester}/${report}_school.json`;
                }
            }
        }
        schoolData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
        var footer;
        var allSubjects = [];
        if (period != 'all') {
            if (subject) {
                footerData = await s3File.readS3File(footerFile);
                subjects();
            }
            if (grade && !subject || !grade && !subject) {
                footer = schoolData['AllSchoolsFooter'];
                if (grade) {
                    subjects();
                }
            } else {
                footerData.map(foot => {
                    footer = foot.subjects[`${subject}`]
                })
            }
        } else {
            if (grade) {
                subjects();
            }
        }
        function subjects() {
            schoolData.data.forEach(item => {
                var sub = Object.keys(item.Subjects);
                var index = sub.indexOf('Grade Performance');
                sub.splice(index, 1);
                sub.forEach(a => {
                    allSubjects.push(a)
                })
            });
            allSubjects = [...new Set(allSubjects)];
        }
        var mydata = schoolData.data;
        logger.info('---PAT school wise api response sent---');
        // , footer: schoolData.AllSchoolsFooter
        res.status(200).send({ data: mydata, subjects: allSubjects, footer: footer });
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
                footerFile = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/${semester}/overall_category/${management}/cluster/grade_subject_footer.json`;
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
                footerFile = `${report}/${period}/cluster/${semester}/grade_subject_footer.json`;
            }
        }
        var schoolData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;
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
        var footer;
        if (period != 'all') {
            if (grad)
                footerData = await s3File.readS3File(footerFile);
            if (grad && !subject) {
                if (footerData && footerData[clusterId])
                    footer = footerData[clusterId][grad];
            } else if (grad && subject) {
                if (footerData && footerData[clusterId])
                    footer = footerData[clusterId][grad].subject[subject];
            } else {
                if (schoolData['footer'])
                    footer = schoolData['footer'][clusterId]
            }
        }

        var mydata = [];
        var allSubjects = [];
        if (period != 'all' && grad) {
            filterData.map(obj => {
                if (obj.Grades[`${grad}`]) {
                    obj['Subjects'] = obj.Grades[`${grad}`]
                    delete obj['Grade Wise Performance'];
                    mydata.push(obj);
                    var subjects = Object.keys(obj['Subjects']);
                    var index = subjects.indexOf('Grade Performance');
                    subjects.splice(index, 1);
                    subjects.map(sub => {
                        allSubjects.push(sub);
                    })
                }
            })
        } else if (period == 'all' && grad) {
            filterData.map(obj => {
                if (obj.Grades[`${grad}`]) {
                    obj['Subjects'] = obj.Grades[`${grad}`]
                    delete obj['Grade Wise Performance'];
                    mydata.push(obj);
                    var subjects = Object.keys(obj.Subjects);
                    var index = subjects.indexOf('Grade Performance');
                    subjects.splice(index, 1);
                    subjects.map(sub => {
                        allSubjects.push(sub);
                    })
                }
            })
        } else {
            mydata = filterData;
        }
        var Subjects = [...new Set(allSubjects)];
        logger.info('---PAT schoolPerCluster api response sent---');
        res.status(200).send({ data: mydata, subjects: Subjects, grades: uniqueGrades, footer: footer });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;