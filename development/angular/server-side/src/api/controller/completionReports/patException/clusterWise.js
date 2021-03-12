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
        var subject = req.body.subject;
        var start = 8;
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
            var updatedMarkers = [];
            var markersWithSubject = [];
            for (let j = 0; j < sortedData.length; j++) {
                var keys = Object.keys(sortedData[j]);
                if (grade && grade != 'all') {
                    var obj1 = {}
                    if (subject != '') {
                        if (sortedData[j].subjects && sortedData[j].subjects[0][`${subject}`] && Object.keys(sortedData[j].subjects[0]).includes(subject)) {
                            for (let i = 0; i <= start; i++) {
                                obj1[`${keys[i]}`] = sortedData[j][`${keys[i]}`];
                            }
                            obj1['subject'] = subject;
                            var keys2 = Object.keys(sortedData[j].subjects[0][`${subject}`]);
                            for (let i = 0; i < keys2.length; i++) {
                                obj1[`${keys2[i]}`] = sortedData[j].subjects[0][`${subject}`][`${keys2[i]}`];
                            }
                            markersWithSubject.push(obj1);
                        } else if (!sortedData[j].subjects) {
                            markersWithSubject.push(sortedData[j]);
                        }
                    }
                }
                var obj = {};
                Object.keys(sortedData[j]).forEach(key => {
                    if (key !== 'subjects') {
                        obj[key] = sortedData[j][key];
                    }
                });
                updatedMarkers.push(obj);
            }
        }
        if (subject) {
            console.log(markersWithSubject);
        } else
            console.log(updatedMarkers);
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