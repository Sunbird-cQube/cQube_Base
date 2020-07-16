const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');

router.post('/stdAttendance', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summary/log_summary_student_attendance.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                console.log(summaryData);
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/sem', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summay/log_summary_sem.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/crc', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summary/log_summary_crc_loc.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/infra', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summary/log_summary_infra.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/inspec', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summary/log_summary_inspec.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stDist', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summary/staic/log_summary_district.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stBlock', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summary/static/log_summary_block.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stCluster', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summary/static/log_summary_cluster.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stSchool', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        const_data['getParams']['Key'] = 'log_summary/static/log_summary_school.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let summaryData = data.Body.toString();
                summaryData = JSON.parse(summaryData);
                logger.info('--- attendance summary api response sent---');
                res.send(summaryData)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});


module.exports = router