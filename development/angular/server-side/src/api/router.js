const router = require('express').Router();
const dist_wise_data = require('./controller/attendanceRoutes/dist_wise_data');
const block_wise_data = require('./controller/attendanceRoutes/block_wise_data');
const cluster_wise_data = require('./controller/attendanceRoutes/cluster_wise_data');
const school_wise_data = require('./controller/attendanceRoutes/school_wise_data');
const getDateRange = require('./controller/attendanceRoutes/getDateRange');

const roleLogin = require('./controller/users/roleBasedLogin');
const changePasswd = require('./controller/users/changePassword');

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

module.exports = router;