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
        var footer = districtsData['footer'];
        districtsData = districtsData.data.sort((a, b) => (a.district_name > b.district_name) ? 1 : -1)
        chartData['labels'] = districtsData.map(a => {
            return a.district_name
        })
        chartData['data'] = districtsData.map(a => {
            return { total_content_plays: a.total_content_plays, percentage: a.percentage }
        })
        logger.info('--- diksha chart allData api response sent ---');
        res.send({ chartData, downloadData: districtsData, footer: footer.total_content_plays });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/dikshaGetCollections', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha chart dikshaGetCollections api ---');
        let collection_type = req.body.collection_type
        var fileName;
        var fileName1;
        var footer;
        if (req.body.timePeriod) {
            let timePeriod = req.body.timePeriod
            fileName = `diksha/bar_chart_reports/${collection_type}/${timePeriod}/all_collections.json`
            fileName1 = `diksha/bar_chart_reports/${collection_type}/${timePeriod}/all_districts.json`
            var districtsData = await s3File.readS3File(fileName1);
            if (districtsData) {
                footer = districtsData['footer'];
                var chartData = {
                    labels: '',
                    data: ''
                }
                districtsData = districtsData.data.sort((a, b) => (a.district_name > b.district_name) ? 1 : -1)
                chartData['labels'] = districtsData.map(a => {
                    return a.district_name
                })
                chartData['data'] = districtsData.map(a => {
                    return { total_content_plays: a.total_content_plays, percentage: a.percentage }
                })
            }
        } else {
            footer = '';
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
        res.send({ uniqueCollections, downloadData: districtsData, chartData, footer: footer.total_content_plays })
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/dikshaGetCollectionData', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha get data on collection select api ---');
        let collection_type = req.body.collection_type
        let collection_name = req.body.collection_name
        var fileName;
        var footerFile;
        if (req.body.timePeriod != '') {
            let timePeriod = req.body.timePeriod
            fileName = `diksha/bar_chart_reports/${collection_type}/${timePeriod}/all_collections.json`;
            footerFile = `diksha/bar_chart_reports/${collection_type}/${timePeriod}/collection_footer.json`
        } else {
            fileName = `diksha/bar_chart_reports/${collection_type}/all_collections.json`;
            footerFile = `diksha/bar_chart_reports/${collection_type}/collection_footer.json`;
        }
        var footerData = await s3File.readS3File(footerFile);
        footerData = footerData.collections[`${collection_name}`];
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
            return { total_content_plays: a.total_content_plays, percentage: a.percentage }
        })
        logger.info('--- diksha get data on collection select api response sent ---');
        res.send({ chartData, downloadData: collectionData, footer: footerData });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});


module.exports = router;