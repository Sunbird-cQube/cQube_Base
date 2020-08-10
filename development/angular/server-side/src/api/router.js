const router = require('express').Router();
<<<<<<< HEAD
const dist_wise_data = require('./controller/attendanceRoutes/dist_wise_data');
const block_wise_data = require('./controller/attendanceRoutes/block_wise_data');
const cluster_wise_data = require('./controller/attendanceRoutes/cluster_wise_data');
const school_wise_data = require('./controller/attendanceRoutes/school_wise_data');
const getDateRange = require('./controller/attendanceRoutes/getDateRange');

const roleLogin = require('./controller/users/roleBasedLogin');
const changePasswd = require('./controller/users/changePassword');

//deeksha
const deekshaData = require('./controller/diksha/diksha');
const dikshaTable = require('./controller/diksha/dikshaTable');

//completion report...
const sem_completionDist = require('./controller/completionReports/semester/districtWise')
const sem_completionBlock = require('./controller/completionReports/semester/blockWise')
const sem_completionCluster = require('./controller/completionReports/semester/clusterWise')
const sem_completionSchool = require('./controller/completionReports/semester/schoolWise')

const school_invalid = require('./controller/completionReports/school_invalid');

// const crcData = require('./controller/users/crcData');
// crc files
const crcDistrictWise = require('../api/controller/crcRoutes/districtWise');
const crcBlockWise = require('../api/controller/crcRoutes/blockWise');
const crcClusterWise = require('../api/controller/crcRoutes/clusterWise');
const crcSchoolWise = require('../api/controller/crcRoutes/schoolWise');

//Infra
const infraDistWise = require('../api/controller/Infra/infra-distWise');
const infraBlockWise = require('../api/controller/Infra/infra-blockWise');
const infraClusterWise = require('../api/controller/Infra/infra-clusterWise');
const infraSchoolWise = require('../api/controller/Infra/infra-schoolWise');

const infraMapDistWise = require('../api/controller/Infra/report_map/infraDistWise');
const infraMapBlockWise = require('../api/controller/Infra/report_map/infraBlockWise');
const infraMapClusterWise = require('../api/controller/Infra/report_map/infraClusterWise');
const infraMapSchoolWise = require('../api/controller/Infra/report_map/infraSchoolWise');

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

// attendance routes
router.use('/attendance', dist_wise_data);
router.use('/attendance', block_wise_data);
router.use('/attendance', cluster_wise_data);
router.use('/attendance', school_wise_data);
router.use('/attendance', getDateRange)

// user details routes
router.use('/roleBasedLogin', roleLogin);
router.use('/changePassword', changePasswd);

// Infra
router.use('/infra', infraDistWise);
router.use('/infra', infraBlockWise);
router.use('/infra', infraClusterWise);
router.use('/infra', infraSchoolWise);

router.use('/infraMap', infraMapDistWise);
router.use('/infraMap', infraMapBlockWise);
router.use('/infraMap', infraMapClusterWise);
router.use('/infraMap', infraMapSchoolWise);
=======
const dist_wise_data = require('./controller/dist_wise_data');
const block_wise_data = require('./controller/block_wise_data');
const cluster_wise_data = require('./controller/cluster_wise_data');
const school_wise_data = require('./controller/school_wise_data');
const getSchoolData = require('./controller/getSchoolData');
const blcokPerDist = require('./controller/blockPerDistrict');
const clustePerBlock = require('./controller/clusterPerBlocks');
const schoolPerCluster = require('./controller/schoolsPerCluster');
const clusterPerDist = require('./controller/clustersPerDist');
const schoolPerDist = require('./controller/schoolPerDist');
const schoolPerBlock = require('./controller/schoolPerBlock');
const schoolCount = require('./controller/schoolCount');
const roleLogin = require('./controller/roleBasedLogin');
const crcData = require('./controller/crcData');

router.use('/crcData', crcData);
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
>>>>>>> upstream/cQube-release-0.12

router.use('/diksha', deekshaData);
router.use('/dikshaTable', dikshaTable);

// Semester completion report
router.use('/semCompDist', sem_completionDist);
router.use('/semCompBlock', sem_completionBlock);
router.use('/semCompCluster', sem_completionCluster);
router.use('/semCompSchool', sem_completionSchool);

router.use('/school_invalid', school_invalid);

module.exports = router;