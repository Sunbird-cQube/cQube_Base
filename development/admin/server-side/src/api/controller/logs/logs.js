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

router.post('/logType/:menuType/:logType', auth.authController, async (req, res) => {
    try {
        logger.info('--- log files api ---');
        var logsDir = process.env.BASE_DIR + "/cqube/nifi/nifi/logs/";
        //var logsDir = __basedir + '/data/logs';
        let files = fs.readdirSync(logsDir);

        let filePath = filePaths[req.params.logType];

        let result = [];
        if (req.params.menuType === 'Nifi') {
            files.filter(file => file.indexOf(filePath.type) > -1).forEach((file, index) => {
                if (index === 0) {
                    const stats = fs.statSync(`${filePath.path}`);
                    result.push({
                        fileName: file,
                        title: filePath.title,
                        path: filePath.path,
                        lastModifiedDate: stats.mtime
                    });
                } else {
                    const stats = fs.statSync(`${logsDir}/${file}`);
                    result.push({
                        fileName: file,
                        title: file.substr(0, file.lastIndexOf('.')),
                        path: `${logsDir}/${file}`,
                        lastModifiedDate: stats.mtime
                    });
                }
            });
        } else {
            const stats = fs.statSync(`${filePath.path}`);

            result.push({
                fileName: filePath.path.split('/')[filePath.path.split('/').length - 1],
                title: filePath.title,
                path: filePath.path,
                lastModifiedDate: stats.mtime
            });
        }
        res.send(result);
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
        });

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/downloadLogFile', auth.authController, (req, res) => {
    try {
        logger.info('--- downloading log file ---');
        var filePath = req.body.path; // Or format the path using the `id` rest param
        var fileName = req.body.fileName; // The default name the browser will use

        res.set("Access-Control-Expose-Headers", "Content-Disposition");
        res.download(filePath, fileName);
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;