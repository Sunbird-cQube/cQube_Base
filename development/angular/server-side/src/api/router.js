const router = require('express').Router();
const dist_wise_data = require('./controller/attendanceRoutes/dist_wise_data');
const block_wise_data = require('./controller/attendanceRoutes/block_wise_data');
const cluster_wise_data = require('./controller/attendanceRoutes/cluster_wise_data');
const school_wise_data = require('./controller/attendanceRoutes/school_wise_data');
const getDateRange = require('./controller/attendanceRoutes/getDateRange');

const changePasswd = require('./controller/users/changePassword');

//deeksha
const deekshaData = require('./controller/diksha/diksha');
const dikshaTable = require('./controller/diksha/dikshaTable');
const diskhaBarChart = require('./controller/diksha/diksha-bar-chart');

//Show telemetry
const showDistTelemetry = require('./controller/telemetry/showTelemetry/distTelemetryData');
const showBlockTelemetry = require('./controller/telemetry/showTelemetry/blockTelemetryData');
const showClusterTelemetry = require('./controller/telemetry/showTelemetry/clusterTelemetryData');
const showSchoolTelemetry = require('./controller/telemetry/showTelemetry/schoolTelemetryData');

//completion report...
const sem_completionDist = require('./controller/completionReports/semester/districtWise')
const sem_completionBlock = require('./controller/completionReports/semester/blockWise')
const sem_completionCluster = require('./controller/completionReports/semester/clusterWise')
const sem_completionSchool = require('./controller/completionReports/semester/schoolWise')

const school_invalid = require('./controller/completionReports/school_invalid');

const telemetryData = require('../api/controller/telemetry/telemetryData');

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

//UDISE report

const UDISE_dist_wise = require('./controller/udise-report/dist-wise');
const UDISE_block_wise = require('./controller/udise-report/block-wise');
const UDISE_cluster_wise = require('./controller/udise-report/cluster-wise');
const UDISE_school_wise = require('./controller/udise-report/school-wise');

//PAT report
const PAT_dist_wise = require('./controller/patRoutes/distWise');
const PAT_block_wise = require('./controller/patRoutes/blockWise');
const PAT_cluster_wise = require('./controller/patRoutes/clusterWise');
const PAT_school_wise = require('./controller/patRoutes/schoolWise');

// Composit report
const composit_dist_wise = require('./controller/composit-report/distWise');
const composit_block_wise = require('./controller/composit-report/blockWise');
const composit_cluster_wise = require('./controller/composit-report/clusterWise');
const composit_school_wise = require('./controller/composit-report/schoolWise');

// Heat chart
const heatDistWise = require('./controller/patRoutes/heatChart/distWise');
const heatBlockWise = require('./controller/patRoutes/heatChart/blockWise');
const heatClusterWise = require('./controller/patRoutes/heatChart/clusterWise');
const heatSchoolWise = require('./controller/patRoutes/heatChart/schoolWise');
const heatMetaData = require('./controller/patRoutes/heatChart/metaData');

// Pat LO table
const loTableDistWise = require('./controller/patRoutes/patLoTable/distWise');
const loTableBlockWise = require('./controller/patRoutes/patLoTable/blockWise');
const loTableClusterWise = require('./controller/patRoutes/patLoTable/clusterWise');
const loTableSchoolWise = require('./controller/patRoutes/patLoTable/schoolWise');

// Diksha TPD
const tpdDistWise = require('./controller/diksha/tpd-heatChart/distWise');
const tpdBlockWise = require('./controller/diksha/tpd-heatChart/blockWise');
const tpdClusterWise = require('./controller/diksha/tpd-heatChart/clusterWise');
const tpdSchoolWise = require('./controller/diksha/tpd-heatChart/schoolWise');

//diksha TPD enrollment/completion
const distLevel = require('./controller/diksha/tpd-enroll-completion/distWise');
const blockLevel = require('./controller/diksha/tpd-enroll-completion/blockWise');
const clusterLevel = require('./controller/diksha/tpd-enroll-completion/clusterWise');
const schoolLevel = require('./controller/diksha/tpd-enroll-completion/schoolWise');



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

router.use('/deeksha', deekshaData);
router.use('/telemetry', telemetryData);
router.use('/diksha', deekshaData);
router.use('/dikshaTable', dikshaTable);
router.use('/dikshaBarChart', diskhaBarChart);

// Semester completion report
router.use('/semCompDist', sem_completionDist);
router.use('/semCompBlock', sem_completionBlock);
router.use('/semCompCluster', sem_completionCluster);
router.use('/semCompSchool', sem_completionSchool);

router.use('/school_invalid', school_invalid);

//show telemetry
router.use('/showDistTelemetry', showDistTelemetry);
router.use('/showBlockTelemetry', showBlockTelemetry);
router.use('/showClusterTelemetry', showClusterTelemetry);
router.use('/showSchoolTelemetry', showSchoolTelemetry);

//Udise......
router.use('/udise', UDISE_dist_wise);
router.use('/udise', UDISE_block_wise);
router.use('/udise', UDISE_cluster_wise);
router.use('/udise', UDISE_school_wise);

//PAT......
router.use('/pat', PAT_dist_wise);
router.use('/pat', PAT_block_wise);
router.use('/pat', PAT_cluster_wise);
router.use('/pat', PAT_school_wise);

//composit report
router.use('/composit', composit_dist_wise);
router.use('/composit', composit_block_wise);
router.use('/composit', composit_cluster_wise);
router.use('/composit', composit_school_wise);

//HeatCharts
router.use('/pat/heatChart', heatDistWise);
router.use('/pat/heatChart', heatBlockWise);
router.use('/pat/heatChart', heatClusterWise);
router.use('/pat/heatChart', heatSchoolWise);
router.use('/pat/heatChart', heatMetaData);

//Pat LO table
router.use('/pat/lotable', loTableDistWise);
router.use('/pat/lotable', loTableBlockWise);
router.use('/pat/lotable', loTableClusterWise);
router.use('/pat/lotable', loTableSchoolWise);

// Diksha TPD
router.use('/diksha/tpd', tpdDistWise);
router.use('/diksha/tpd', tpdBlockWise);
router.use('/diksha/tpd', tpdClusterWise);
router.use('/diksha/tpd', tpdSchoolWise);

const dataSource = require('./controller/dataSource');
router.use('/dataSource', dataSource);

//diksha TPD enrollment/completion
router.use('/tpd', distLevel);
router.use('/tpd', blockLevel);
router.use('/tpd', clusterLevel);
router.use('/tpd', schoolLevel);

module.exports = router;