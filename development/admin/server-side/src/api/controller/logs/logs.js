const router = require('express').Router();
const { logger } = require('../../lib/logger');
const { filePaths, menus } = require('../../lib/logVariables');
const auth = require('../../middleware/check-auth');
var shell = require('shelljs');
const fs = require("fs");
const zlib = require('zlib');

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
        let result = [];
        let filePath = filePaths[req.params.logType];

        if (req.params.menuType === 'Nifi') {
            var logsDir = process.env.BASE_DIR + "/cqube/nifi/nifi/logs/";
            //var logsDir = __basedir + '/data/logs';
            let files = fs.readdirSync(logsDir);

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
        } else if (req.params.menuType === 'PostgreSql') {
            var logsDir = "/var/log/postgresql/";
            //var logsDir = __basedir + '/data/postgresql/';
            let files = fs.readdirSync(logsDir);

            files.filter(fileName => fileName.indexOf('log.swp') === -1).forEach((file, index) => {
                if (index === 0) {
                    const stats = fs.statSync(`${filePath.path}`);

                    result.push({
                        fileName: filePath.path.split('/')[filePath.path.split('/').length - 1],
                        title: filePath.title,
                        path: filePath.path,
                        lastModifiedDate: stats.mtime
                    });
                }

                const stats = fs.statSync(`${logsDir}/${file}`);
                if (file.indexOf('.gz') > -1) {
                    result.push({
                        fileName: `${file.slice(0, -3).replace('.log.', '-')}.log`,
                        title: file.slice(0, -3).replace('.log.', '-'),
                        path: `${logsDir}/${file}`,
                        lastModifiedDate: stats.mtime,
                        gz: true
                    });
                } else {
                    let fileName = file.substr(-4) === '.log' ? file : `${file.replace('.log.', '-')}.log`;
                    result.push({
                        fileName,
                        title: file.substr(0, file.lastIndexOf('.')),
                        path: `${logsDir}/${file}`,
                        lastModifiedDate: stats.mtime,
                        gz: false
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
        var gzBool = req.body.data.gz;
        var data;

        fs.access(filePath, function (error) {
            if (error) {
                res.status(200).json({ errMsg: "No such file or directory" });
            } else {
                if (!varBool) {
                    let fun = () => {
                        let a = shell.exec(`sudo du -sh ${filePath}`);
                        a = a.split('/')
                        data = shell.tail({ '-n': 200 }, filePath).stdout;
                        if (gzBool) {
                            fs.unlink(filePath, () => { });
                        }
                        logger.info('--- logs show data api response sent---');
                        res.status(200).json({ data: data, fileSize: a[0] });
                    };
                    if (gzBool) {
                        const fileContents = fs.createReadStream(`${filePath}`);
                        const writeStream = fs.createWriteStream(`${filePath.slice(0, -3)}`);
                        const unzip = zlib.createGunzip();
                        fileContents.pipe(unzip).pipe(writeStream).on('finish', (err) => {
                            filePath = filePath.slice(0, -3);
                            fun();
                        });
                    } else {
                        fun();
                    }
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
        var gzBool = req.body.gz;

        let fun = () => {
            res.set("Access-Control-Expose-Headers", "Content-Disposition");
            res.download(filePath, fileName, function(error) {
                if (gzBool) {
                    fs.unlink(filePath, () => { });
                }
            });
        }

        if (gzBool) {
            const fileContents = fs.createReadStream(`${filePath}`);
            const writeStream = fs.createWriteStream(`${filePath.slice(0, -3)}`);
            const unzip = zlib.createGunzip();
            fileContents.pipe(unzip).pipe(writeStream).on('finish', (err) => {
                filePath = filePath.slice(0, -3);
                fun();
            });
        } else {
            fun();
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;