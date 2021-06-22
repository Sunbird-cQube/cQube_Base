const router = require('express').Router();
const { logger } = require('../../lib/logger');
var const_data = require('../../lib/config');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc all cluster wise api ---');
        var timePeriod = req.body.timePeriod;
        var year = req.body.year;
        var month = req.body.month
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category == 'overall') {
            if (timePeriod && timePeriod != 'select_month') {
                fileName = `crc/school_management_category/${timePeriod}/overall_category/${management}/cluster.json`;
            } else {
                fileName = `crc/school_management_category/${year}/${month}/overall_category/${management}/cluster.json`;
            }
        } else {
            if (timePeriod && timePeriod != 'select_month') {
                fileName = `crc/${timePeriod}/cluster.json`;
            } else {
                fileName = `crc/${year}/${month}/cluster.json`;
            }
        }
        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;

        var clusterData = jsonData.data;

        logger.info('--- crc all cluster wise api response sent ---');
        res.status(200).send({ visits: clusterData });
        // }
        // await reader.close();
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/clusterWise/:distId/:blockId', auth.authController, async (req, res) => {
    try {
        logger.info('--- crc cluster per block api ---');
        var timePeriod = req.body.timePeriod;
        var year = req.body.year;
        var month = req.body.month
        var management = req.body.management;
        var category = req.body.category;
        let fileName;
        if (management != 'overall' && category == 'overall') {
            if (timePeriod && timePeriod != 'select_month') {
                fileName = `crc/school_management_category/${timePeriod}/overall_category/${management}/cluster.json`;
            } else {
                fileName = `crc/school_management_category/${year}/${month}/overall_category/${management}/cluster.json`;
            }
        } else {
            if (timePeriod && timePeriod != 'select_month') {
                fileName = `crc/${timePeriod}/cluster.json`;
            } else {
                fileName = `crc/${year}/${month}/cluster.json`;
            }
        }
        var jsonData = await s3File.storageType == "s3" ? await s3File.readS3File(fileName) : await s3File.readLocalFile(fileName);;

        var clusterData = jsonData

        // let distId = req.params.distId;
        let blockId = req.params.blockId;

        let filterData = clusterData.data.filter(obj => {
            return (obj.blockId == blockId);
        });
        if (filterData.length > 0) {
            logger.info('---  crc cluster per block api response sent ---');
            res.status(200).send({ visits: filterData, schoolsVisitedCount: clusterData.footer[`${blockId}`] });
        } else {
            res.status(403).json({ errMsg: "No matches found" });
        }

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;