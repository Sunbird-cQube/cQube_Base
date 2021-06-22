const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const readFile = require('../../lib/readFiles')

router.post('/stdAttendance', auth.authController, async (req, res) => {
    try {
        logger.info('---attendance summary api ---');
        var fileName = 'log_summary/log_summary_student_attendance.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- attendance summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/teacherAttedndance', auth.authController, async (req, res) => {
    try {
        logger.info('---diksha TPD summary api ---');
        var fileName = 'log_summary/log_summary_teacher_attendance.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- diksha TPD summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/sem', auth.authController, async (req, res) => {
    try {
        logger.info('---semester summary api ---');
        var fileName = 'log_summary/log_summary_sem.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- semester summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/crc', auth.authController, async (req, res) => {
    try {
        logger.info('---crc summary api ---');
        var fileName = 'log_summary/log_summary_crc_loc.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- crc summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/infra', auth.authController, async (req, res) => {
    try {
        logger.info('---infra summary api ---');
        var fileName = 'log_summary/log_summary_infra.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- infra summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/inspec', auth.authController, async (req, res) => {
    try {
        logger.info('---inspection summary api ---');
        var fileName = 'log_summary/log_summary_inspec.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- inspection summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stDist', auth.authController, async (req, res) => {
    try {
        logger.info('---district static summary api ---');
        var fileName = 'log_summary/static/log_summary_district.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- district static summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stBlock', auth.authController, async (req, res) => {
    try {
        logger.info('---block static summary api ---');
        var fileName = 'log_summary/static/log_summary_block.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- block static summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stCluster', async (req, res) => {
    try {
        logger.info('---cluster static summary api ---');
        var fileName = 'log_summary/static/log_summary_cluster.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- cluster static summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/stSchool', auth.authController, async (req, res) => {
    try {
        logger.info('---school static summary api ---');
        var fileName = 'log_summary/static/log_summary_school.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- school static summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/summaryDiksha', auth.authController, async (req, res) => {
    try {
        logger.info('---diksha summary api ---');
        var fileName = 'log_summary/log_summary_diksha.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- diksha summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/summaryUDISE', auth.authController, async (req, res) => {
    try {
        logger.info('---udise summary api ---');
        var fileName = 'log_summary/log_summary_udise.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- udise summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/summaryPAT', auth.authController, async (req, res) => {
    try {
        logger.info('---pat summary api ---');
        var fileName = 'log_summary/log_summary_pat.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- pat summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/summarySAT', auth.authController, async (req, res) => {
    try {
        logger.info('---sat summary api ---');
        var fileName = 'log_summary/log_summary_sat.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- sat summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/summaryDikshaTPD', auth.authController, async (req, res) => {
    try {
        logger.info('---diksha TPD summary api ---');
        var fileName = 'log_summary/log_summary_diksha_tpd.json';
        let summaryData = await readFile.storageType == "s3" ? await readFile.readS3File(fileName) : await readFile.readLocalFile(fileName);
        logger.info('--- diksha TPD summary api response sent---');
        if (summaryData == null || summaryData == '') {
            res.send([]);
        } else {
            res.send(summaryData)
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router