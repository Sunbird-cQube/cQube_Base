const router = require('express').Router();
const dist_wise_data = require('./controller/dist_wise_data');
const block_wise_data = require('./controller/block_wise_data');
const cluster_wise_data = require('./controller/cluster_wise_data');
const school_wise_data = require('./controller/school_wise_data');
const getSchoolData = require('./controller/getSchoolData');


router.use('/dist_wise_data', dist_wise_data);
router.use('/block_wise_data', block_wise_data);
router.use('/cluster_wise_data', cluster_wise_data);
router.use('/school_wise_data', school_wise_data);
router.use('/getSchoolData', getSchoolData);

module.exports = router;