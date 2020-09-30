const router = require('express').Router();
const { logger } = require('../../lib/logger');
var const_data = require('../../lib/config');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/allClusterWise', auth.authController, async (req, res) => {
  try {
    logger.info('--- crc all cluster wise api ---');
    let fileName = `crc/cluster_crc_opt_json.json`;
    var jsonData = await s3File.readS3File(fileName);

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
    let fileName = `crc/cluster_crc_opt_json.json`;
    var jsonData = await s3File.readS3File(fileName);

    var clusterData = jsonData

    let distId = req.params.distId;
    let blockId = req.params.blockId;

    let filterData = clusterData.data.filter(obj => {
      return (obj.districtId == distId && obj.blockId == blockId);
    });
    if (filterData.length > 0) {
      logger.info('---  crc cluster per block api response sent ---');
      res.status(200).send({ visits: filterData, schoolsVisitedCount: clusterData.footer[`${blockId}`] });
    }else{
      res.status(403).json({errMsg: "No matches found"});
    }
   
  } catch (e) {
    logger.error(`Error :: ${e}`)
    res.status(500).json({ errMessage: "Internal error. Please try again!!" });
  }
})

module.exports = router;