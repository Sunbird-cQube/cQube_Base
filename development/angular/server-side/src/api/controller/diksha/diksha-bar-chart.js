const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/dikshaAllData', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha chart allData api ---');
        let collection_type = req.body.collection_type
        var fileName = `diksha/bar_chart_reports/${collection_type}/all_districts.json`
        var districtsData = await s3File.readS3File(fileName);
        var chartData = {
            labels: '',
            data: ''
        }
        districtsData = districtsData.sort((a, b) => (a.district_name > b.district_name) ? 1 : -1)
        chartData['labels'] = districtsData.map(a => {
            return a.district_name
        })
        chartData['data'] = districtsData.map(a => {
            return a.total_content_plays
        })
        logger.info('--- diksha chart allData api response sent ---');
        res.send({ chartData, downloadData: districtsData });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/dikshaGetCollections',auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha chart dikshaGetCollections api ---');
        let collection_type = req.body.collection_type
        var fileName;
        var fileName1;
        if (req.body.timePeriod) {
            let timePeriod = req.body.timePeriod
            fileName = `diksha/bar_chart_reports/${collection_type}/${timePeriod}/all_collections.json`
            fileName1 = `diksha/bar_chart_reports/${collection_type}/${timePeriod}/all_districts.json`
            var districtsData = await s3File.readS3File(fileName1);
            if (districtsData) {
                var chartData = {
                    labels: '',
                    data: ''
                }
                districtsData = districtsData.sort((a, b) => (a.district_name > b.district_name) ? 1 : -1)
                chartData['labels'] = districtsData.map(a => {
                    return a.district_name
                })
                chartData['data'] = districtsData.map(a => {
                    return a.total_content_plays
                })
            }
        } else {
            fileName = `diksha/bar_chart_reports/${collection_type}/all_collections.json`
        }

        var collectionData = await s3File.readS3File(fileName);

        let collections;
        collections = collectionData.map(val => {
            return val.collection_name
        })
        let uniqueCollections = collections.filter(function (elem, pos) {
            return collections.indexOf(elem) == pos;
        })
        logger.info('--- diksha chart dikshaGetCollections api response sent ---');
        res.send({ uniqueCollections, downloadData: districtsData, chartData })
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/dikshaGetCollectionData',auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha get data on collection select api ---');
        let collection_type = req.body.collection_type
        let collection_name = req.body.collection_name
        var fileName;
        if (req.body.timePeriod != '') {
            let timePeriod = req.body.timePeriod
            fileName = `diksha/bar_chart_reports/${collection_type}/${timePeriod}/all_collections.json`
        } else {
            fileName = `diksha/bar_chart_reports/${collection_type}/all_collections.json`
        }
        var collectionData = await s3File.readS3File(fileName);
        collectionData = collectionData.filter(a => {
            return a.collection_name == collection_name
        })
        var chartData = {
            labels: '',
            data: ''
        }
        collectionData = collectionData.sort((a, b) => (a.district_name > b.district_name) ? 1 : -1)
        chartData['labels'] = collectionData.map(a => {
            return a.district_name
        })
        chartData['data'] = collectionData.map(a => {
            return a.total_content_plays
        })
        logger.info('--- diksha get data on collection select api response sent ---');
        res.send({ chartData, downloadData: collectionData });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})


module.exports = router;