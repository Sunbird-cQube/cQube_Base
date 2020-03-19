const router = require('express').Router();
const s3_month_wise_data = require('./controller/s3data_month_wise');
const s3_school_wise_data = require('./controller/s3data_school_wise');
const s3_gender_wise_data = require('./controller/s3data_gender_wise');
const s3_key_performance_indicators = require('./controller/s3_key_performance_indicators');
const getSchoolPerformance = require('./controller/getSchoolPerformance');


router.use('/s3-month-wise', s3_month_wise_data);
router.use('/s3-school-wise', s3_school_wise_data);
router.use('/s3-gender-wise', s3_gender_wise_data);
router.use('/s3-kpi', s3_key_performance_indicators);
router.use('/getSchoolPerformance', getSchoolPerformance);



module.exports = router;