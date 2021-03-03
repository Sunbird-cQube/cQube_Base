const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const groupArray = require('group-array');

router.post('/getMonthYear', auth.authController, function (req, res) {
    try {
        logger.info('---getDateRange api ---');
        var report = req.body.report;
        var fileName;
        if (report == 'sar') {
            fileName = `data_replay/stud_att_meta.json`;
        } else if (report == 'tar') {
            fileName = `data_replay/tch_att_meta.json`;
        } else {
            fileName = `data_replay/crc_meta.json`;
        }
        const_data['getParams']['Key'] = fileName;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let dateObj = data.Body.toString();
                dateObj = JSON.parse(dateObj);
                let date = groupArray(dateObj, 'year')
                logger.info('--- getDateRange response sent ---');
                res.status(200).send(date);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/getSemesters', auth.authController, function (req, res) {
    try {
        logger.info('---getSemesters api ---');
        var fileName = `data_replay/sat_meta.json`;

        const_data['getParams']['Key'] = fileName;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let dataObj = data.Body.toString();
                dataObj = JSON.parse(dataObj);
                logger.info('--- getSemesters response sent ---');
                res.status(200).send(dataObj);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/getBatchIds', auth.authController, function (req, res) {
    try {
        logger.info('---getBatchIds api ---');
        var fileName = `data_replay/diksha_tpd_meta.json`;

        const_data['getParams']['Key'] = fileName;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let dataObj = data.Body.toString();
                dataObj = JSON.parse(dataObj);
                logger.info('--- getBatchIds response sent ---');
                res.status(200).send(dataObj);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/getExamCode', auth.authController, function (req, res) {
    try {
        logger.info('---getExamCode api ---');
        var fileName = `data_replay/pat_meta.json`;

        const_data['getParams']['Key'] = fileName;
        const_data['s3'].getObject(const_data['getParams'], function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let dataObj = data.Body.toString();
                dataObj = JSON.parse(dataObj);
                logger.info('--- getExamCode response sent ---');
                res.status(200).send(dataObj);
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;