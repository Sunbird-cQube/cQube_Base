const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allDistData', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha chart allData api ---');
        let timePeriod = req.body.timePeriod;
        var fileName = `diksha_tpd/report2/${timePeriod}/district/all_collections.json`;
        var districtsData = await s3File.readS3File(fileName);
        var footer = districtsData['footer'];
        var chartData = {
            labels: '',
            data: ''
        }
        
        districtsData = districtsData.data.sort((a, b) => (a.district_name > b.district_name) ? 1 : -1)
        chartData['labels'] = districtsData.map(a => {
            return a.district_name
        })
        chartData['data'] = districtsData.map(a => {
            return { enrollment: a.total_enrolled, completion: a.total_completed, percent_teachers: a.percentage_teachers, percent_completion: a.percentage_completion }
        })
        logger.info('--- diksha chart allData api response sent ---');
        res.send({ chartData, downloadData: districtsData, footer });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/getCollections', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha chart dikshaGetCollections api ---');
        var fileName;
        var allCollections;
        let timePeriod = req.body.timePeriod
        let level = req.body.level;
        let id = req.body.id;
        if (level == 'district') {
            fileName = `diksha_tpd/report2/${timePeriod}/district/collections.json`;
        } else {
            fileName = `diksha_tpd/report2/${timePeriod}/${level}/collections/${id}.json`;
        }
        var collectionsList = await s3File.readS3File(fileName);

        if (collectionsList) {
            let collections;
            collections = collectionsList.data.map(val => {
                return val.collection_name
            })
            allCollections = collections.filter(function (elem, pos) {
                return collections.indexOf(elem) == pos;
            });

        }
        logger.info('--- diksha chart dikshaGetCollections api response sent ---');
        res.send({ allCollections })
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/getCollectionData', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha get data on collection select api ---');
        let collection_name = req.body.collection_name
        var fileName;

        let timePeriod = req.body.timePeriod
        let level = req.body.level;
        let id = req.body.id;
        let clusterId = req.body.clusterId;

        if (level == 'district') {
            fileName = `diksha_tpd/report2/${timePeriod}/district/collections.json`;
        } else {
            fileName = `diksha_tpd/report2/${timePeriod}/${level}/collections/${id}.json`;
        }

        var collectionData = await s3File.readS3File(fileName);
        collectionData = collectionData.data.filter(a => {
            return a.collection_name == collection_name
        })
        var chartData = {
            labels: '',
            data: ''
        }
        if (level == "district") {
            collectionData = collectionData.sort((a, b) => (a.district_name > b.district_name) ? 1 : -1)
            chartData['labels'] = collectionData.map(a => {
                return a.district_name
            })
        }
        if (level == "block") {
            collectionData = collectionData.filter(a => {
                return a.district_id == id;
            });
            collectionData = collectionData.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1)
            chartData['labels'] = collectionData.map(a => {
                return a.block_name
            })
        }
        if (level == "cluster") {
            collectionData = collectionData.filter(a => {
                return a.block_id == id;
            });
            collectionData = collectionData.sort((a, b) => (a.cluster_name > b.cluster_name) ? 1 : -1)
            chartData['labels'] = collectionData.map(a => {
                return a.cluster_name
            })
        }
        if (level == "school") {
            collectionData = collectionData.filter(a => {
                return a.cluster_id == clusterId;
            });
            collectionData = collectionData.sort((a, b) => (a.school_name > b.school_name) ? 1 : -1)
            chartData['labels'] = collectionData.map(a => {
                return a.school_name
            })
        }

        chartData['data'] = collectionData.map(a => {
            return { enrollment: a.total_enrolled, completion: a.total_completed, percent_teachers: a.percentage_teachers, percent_completion: a.percentage_completion }
        })
        logger.info('--- diksha get data on collection select api response sent ---');
        res.send({ chartData, downloadData: collectionData });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});


module.exports = router;