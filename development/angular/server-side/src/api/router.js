const router = require('express').Router();
const dist_wise_data = require('./controller/attendanceRoutes/dist_wise_data');
const block_wise_data = require('./controller/attendanceRoutes/block_wise_data');
const cluster_wise_data = require('./controller/attendanceRoutes/cluster_wise_data');
const school_wise_data = require('./controller/attendanceRoutes/school_wise_data');
const getSchoolData = require('./controller/attendanceRoutes/getSchoolData');
const blcokPerDist = require('./controller/attendanceRoutes/blockPerDistrict');
const clustePerBlock = require('./controller/attendanceRoutes/clusterPerBlocks');
const schoolPerCluster = require('./controller/attendanceRoutes/schoolsPerCluster');
const clusterPerDist = require('./controller/attendanceRoutes/clustersPerDist');
const schoolPerDist = require('./controller/attendanceRoutes/schoolPerDist');
const schoolPerBlock = require('./controller/attendanceRoutes/schoolPerBlock');
const schoolCount = require('./controller/attendanceRoutes/schoolCount');
const roleLogin = require('./controller/users/roleBasedLogin');
const changePasswd = require('./controller/users/changePassword');
const addUser = require('./controller/users/addUser');
// const crcData = require('./controller/users/crcData');
// crc files
const crcDistrictWise = require('../api/controller/crcRoutes/districtWise');
const crcBlockWise = require('../api/controller/crcRoutes/blockWise');
const crcClusterWise = require('../api/controller/crcRoutes/clusterWise');
const crcSchoolWise = require('../api/controller/crcRoutes/schoolWise');

const semDistrictWise = require('../api/controller/semRoutes/districtWise');
const semBlockWise = require('../api/controller/semRoutes/blockWise');
const semClusterWise = require('../api/controller/semRoutes/clusterWise');
const semSchoolWise = require('../api/controller/semRoutes/schoolWise');
// sem routes
router.use('/sem', semDistrictWise);
router.use('/sem', semBlockWise);
router.use('/sem', semClusterWise);
router.use('/sem', semSchoolWise);

// crc routes
router.use('/crc', crcDistrictWise);
router.use('/crc', crcBlockWise);
router.use('/crc', crcClusterWise);
router.use('/crc', crcSchoolWise);

// router.use('/crcData', crcData);
router.use('/dist_wise_data', dist_wise_data);
router.use('/block_wise_data', block_wise_data);
router.use('/cluster_wise_data', cluster_wise_data);
router.use('/school_wise_data', school_wise_data);
router.use('/getSchoolData', getSchoolData);
router.use('/blcokPerDist', blcokPerDist);
router.use('/clustePerBlock', clustePerBlock);
router.use('/schoolPerCluster', schoolPerCluster);
router.use('/clusterPerDist', clusterPerDist);
router.use('/schoolPerDist', schoolPerDist);
router.use('/schoolPerBlock', schoolPerBlock);
router.use('/schoolCount', schoolCount);
router.use('/roleBasedLogin', roleLogin);
router.use('/changePassword', changePasswd);
router.use('/addUser', addUser);

module.exports = router;