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
                logger.info('--- attendance summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }

            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/sem', auth.authController, async (req, res) => {
    try {
        logger.info('---semester summary api ---');
        const_data['getParams']['Key'] = 'log_summary/log_summary_sem.json';
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
                logger.info('--- semester summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/crc', auth.authController, async (req, res) => {
    try {
        logger.info('---crc summary api ---');
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
                logger.info('--- crc summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/infra', auth.authController, async (req, res) => {
    try {
        logger.info('---infra summary api ---');
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
                logger.info('--- infra summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/inspec', auth.authController, async (req, res) => {
    try {
        logger.info('---inspection summary api ---');
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
                logger.info('--- inspection summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stDist', auth.authController, async (req, res) => {
    try {
        logger.info('---district static summary api ---');
        const_data['getParams']['Key'] = 'log_summary/static/log_summary_district.json';
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
                logger.info('--- district static summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stBlock', auth.authController, async (req, res) => {
    try {
        logger.info('---block static summary api ---');
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
                logger.info('--- block static summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stCluster', async (req, res) => {
    try {
        logger.info('---cluster static summary api ---');
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
                logger.info('--- cluster static summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stSchool', auth.authController, async (req, res) => {
    try {
        logger.info('---school static summary api ---');
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
                logger.info('--- school static summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/summaryDiksha', auth.authController, async (req, res) => {
    try {
        logger.info('---diksha summary api ---');
        const_data['getParams']['Key'] = 'log_summary/log_summary_diksha.json';
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
                logger.info('--- diksha summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/summaryUDISE', auth.authController, async (req, res) => {
    try {
        logger.info('---udise summary api ---');
        const_data['getParams']['Key'] = 'log_summary/log_summary_udise.json';
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
                logger.info('--- udise summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/summaryPAT', auth.authController, async (req, res) => {
    try {
        logger.info('---pat summary api ---');
        const_data['getParams']['Key'] = 'log_summary/log_summary_pat.json';
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
                logger.info('--- pat summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});
router.post('/summaryDikshaTPD', auth.authController, async (req, res) => {
    try {
        logger.info('---diksha TPD summary api ---');
        const_data['getParams']['Key'] = 'log_summary/log_summary_diksha_tpd.json';
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
                logger.info('--- diksha TPD summary api response sent---');
                if (summaryData == null || summaryData == '') {
                    res.send([]);
                } else {
                    res.send(summaryData)
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router