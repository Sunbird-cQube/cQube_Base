const router = require('express').Router();
const dist_wise_data = require('./controller/attendanceRoutes/dist_wise_data');
const block_wise_data = require('./controller/attendanceRoutes/block_wise_data');
const cluster_wise_data = require('./controller/attendanceRoutes/cluster_wise_data');
const school_wise_data = require('./controller/attendanceRoutes/school_wise_data');

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

// attendance routes
router.use('/attendance', dist_wise_data);
router.use('/attendance', block_wise_data);
router.use('/attendance', cluster_wise_data);
router.use('/attendance', school_wise_data);

// user details routes
router.use('/roleBasedLogin', roleLogin);
router.use('/changePassword', changePasswd);
router.use('/addUser', addUser);

module.exports = router;