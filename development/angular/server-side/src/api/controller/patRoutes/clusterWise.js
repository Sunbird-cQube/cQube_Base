const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async(req, res) => {
    try {
        logger.info('---PAT cluster wise api ---');
        var period = req.body.data.period;
        var grade = req.body.data.grade;
        var report = req.body.data.report;
        var semester = req.body.data.sem;
        var academic_year = req.body.data.year;
        var month = req.body.data.month;
        var management = req.body.data.management;
        var category = req.body.data.category;
        var fileName;
        var clusterData = {}

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
                    } else {
                        fileName = `${report}/${academic_year}/${month}/cluster/${grade}.json`;
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
                } else {
                    fileName = `${report}/${period}/${semester}/${report}_cluster.json`;
                }
            }
        }

        clusterData = await s3File.readS3File(fileName);
        var mydata = clusterData.data;
        logger.info('---PAT cluster wise api response sent---');
        // , footer: clusterData.AllClustersFooter
        res.status(200).send({ data: mydata });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController, async(req, res) => {
    try {
        logger.info('---PAT clusterperBlock api ---');
        var period = req.body.data.period;
        var report = req.body.data.report;
        var semester = req.body.data.sem;
        var academic_year = req.body.data.year;
        var month = req.body.data.month;
        var management = req.body.data.management;
        var category = req.body.data.category;
        var fileName;

        if (management != 'overall' && category == 'overall') {
            if (report == 'pat') {
                if (period != 'select_month') {
                    fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/overall_category/${management}/cluster.json`;
                } else {
                    fileName = `${report}/school_management_category/${academic_year}/${month}/overall_category/${management}/cluster.json`;
                }
            } else {
                fileName = `${report}/school_management_category/${period == 'all' ? 'overall' : period}/${semester}/overall_category/${management}/cluster.json`;
            }
        } else {
            if (report == 'pat') {
                if (period != 'select_month') {
                    fileName = `${report}/${period}/${report}_cluster.json`;
                } else {
                    fileName = `${report}/${academic_year}/${month}/cluster/cluster.json`;
                }
            } else {
                fileName = `${report}/${period}/${semester}/${report}_cluster.json`;
            }
        }

        var clusterData = await s3File.readS3File(fileName);

        let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.Details.district_id == distId && obj.Details.block_id == blockId)
        })
        let mydata = filterData;
        logger.info('---PAT clusterperBlock api response sent---');
        // , footer: clusterData.footer[`${blockId}`] 
        res.status(200).send({ data: mydata });


    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;