const router = require('express').Router();
const auth = require('../../middleware/check-auth');
const { logger } = require('../../lib/logger');
var shell = require('shelljs');

var filePath = '~/Documents/logFiles/jmeter.log';

router.post('/nodeLog', auth.authController, function (req, res) {
    try {
        logger.info('---node logs api ---');
        var varBool = req.body.data;
        var data;
        if (!varBool) {
            data = shell.tail({ '-n': 200 }, filePath).stdout;
            logger.info('---node logs show data api response sent---');
            res.status(200).json(data);
        } else if (varBool) {
            data = shell.cat(filePath).stdout;
            logger.info('--- node logs download data api response sent---');
            res.status(200).json(data);
        }

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});


router.post('/angularLog', auth.authController, function (req, res) {
    try {
        logger.info('---angular logs api ---');
        var varBool = req.body.data;
        var data;
        if (!varBool) {
            data = shell.tail({ '-n': 200 }, filePath).stdout;
            logger.info('---angular logs show data api response sent---');
            res.status(200).json(data);
        } else if (varBool) {
            data = shell.cat(filePath).stdout;
            logger.info('---angular logs download data api response sent---');
            res.status(200).json(data);
        }

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/nifiLog', auth.authController, function (req, res) {
    try {
        logger.info('---nifi logs api ---');
        var varBool = req.body.data;
        var data;
        if (!varBool) {
            data = shell.tail({ '-n': 200 }, filePath).stdout;
            logger.info('---nifi logs show data api response sent---');
            res.status(200).json(data);
        } else if (varBool) {
            data = shell.cat(filePath).stdout;
            logger.info('---nifi logs download data api response sent---');
            res.status(200).json(data);
        }

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;