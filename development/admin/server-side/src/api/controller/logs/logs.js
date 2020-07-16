const router = require('express').Router();
const { logger } = require('../../lib/logger');
const { filePaths, menus } = require('../../lib/logVariables');
const auth = require('../../middleware/check-auth');
var shell = require('shelljs');
const fs = require("fs")

router.get('/getMenus', auth.authController, async (req, res) => {
    try {
        logger.info('--- getMenus api ---');
        res.send(menus)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

router.post('/logType/:logType', auth.authController, async (req, res) => {
    try {
        logger.info('--- log files api ---');
        res.send(filePaths[req.params.logType])
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});


router.post('/showLogs', auth.authController, (req, res) => {
    try {
        logger.info('---logs api ---');
        var filePath = req.body.data.path;
        var varBool = req.body.data.download;
        var data;

        fs.access(filePath, function (error) {
            if (error) {
                res.status(200).json({ errMsg: "No such file or directory" });
            } else {
                if (!varBool) {
                    let a = shell.exec(`sudo du -sh ${filePath}`);
                    a = a.split('/')
                    data = shell.tail({ '-n': 200 }, filePath).stdout;
                    logger.info('--- logs show data api response sent---');
                    res.status(200).json({ data: data, fileSize: a[0] });

                } else if (varBool) {
                    data = shell.cat(filePath).stdout;
                    logger.info('--- logs download data api response sent---');
                    res.status(200).json(data);
                }
            }
        })

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;