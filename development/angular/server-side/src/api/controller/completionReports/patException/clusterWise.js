const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- pat exception cluster wise api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        let fileName;
        if (grade && grade != 'all') {
            fileName = `exception_list/pat_exception/grade/${timePeriod}/cluster/${grade}.json`
        } else {
            fileName = `exception_list/pat_exception/${timePeriod}/cluster.json`
        }
        var clusterData = await s3File.readS3File(fileName);
        var Subjects = [];
        var sortedData;
        if (clusterData) {
            sortedData = clusterData['data'].sort((a, b) => (a.cluster_name) > (b.cluster_name) ? 1 : -1);
            if (grade && grade != 'all') {
                sortedData.map(item => {
                    if (item.subjects) {
                        Object.keys(item.subjects[0]).map(key => {
                            Subjects.push(key);
                        })
                    }
                });
                Subjects = [...new Set(Subjects)];
            }
        }
        logger.info('--- pat exception cluster wise api response sent---');
        res.status(200).send({ data: sortedData, footer: clusterData.allClustersFooter.total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        logger.info('---pat exception clusterperBlock api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        let fileName;
        if (grade && grade != 'all') {
            fileName = `exception_list/pat_exception/grade/${timePeriod}/cluster/${grade}.json`
        } else {
            fileName = `exception_list/pat_exception/${timePeriod}/cluster.json`
        }
        var clusterData = await s3File.readS3File(fileName);

        let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.district_id == distId && obj.block_id == blockId)
        })
        var Subjects = [];
        var sortedData;
        if (filterData) {
            sortedData = filterData.sort((a, b) => (a.cluster_name) > (b.cluster_name) ? 1 : -1);
            if (grade && grade != 'all') {
                sortedData.map(item => {
                    if (item.subjects) {
                        Object.keys(item.subjects[0]).map(key => {
                            Subjects.push(key);
                        })
                    }
                });
                Subjects = [...new Set(Subjects)];
            }
        }
        logger.info('---pat exception clusterperBlock api response sent---');
        res.status(200).send({ data: sortedData, footer: clusterData.footer[`${blockId}`].total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
    } catch (e) {
        logger.error(e);
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;