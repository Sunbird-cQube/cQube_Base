const { logger } = require('../../lib/logger');
var schedule = require('node-schedule');
const fs = require('fs');
const axios = require('axios');
var filePath = `${process.env.BASE_DIR}/cqube/admin_dashboard/schedulers.json`;
var shell = require('shelljs');

exports.restartNifiProcess = async function () {
    try {
        var schedularData = []
        if (fs.existsSync(filePath)) {
            await changePermission();
            schedularData = JSON.parse(fs.readFileSync(filePath));
        }
        var url = ''
        await schedularData.forEach(async myJob => {
            url = `${process.env.NIFI_URL}/flow/process-groups/${myJob.groupId}`
            if (myJob.state == "RUNNING") {
                logger.info('Rescheduling jobs due to nodejs restart');
                await schedule.scheduleJob(myJob.groupId, `${myJob.mins} ${myJob.hours} * * *`, async function () {
                    logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling started ---`);
                    let response = await startFun(url, myJob.groupId, myJob.state);
                    myJob.scheduleUpdatedAt = `${new Date()}`;
                    await fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                        if (err) throw err;
                        logger.info('Restart process - Scheduled RUNNING Job - Restarted successfully');
                    });
                    setTimeout(() => {
                        logger.info(' --- executing nifi restart shell command ----');
                        shell.exec(`sudo ${process.env.BASE_DIR}/nifi/bin/nifi.sh restart`, function (code, stdout, stderr) {
                            console.log('Exit code:', code);
                            console.log('Program output:', stdout);
                            console.log('Program stderr:', stderr);
                        });
                    }, 120000);
                    logger.info(JSON.stringify(response))
                    logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling completed ---`);
                });
                await schedule.scheduleJob(myJob.groupId, `${myJob.mins} ${myJob.timeToStop} * * *`, async function () {
                    logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling stopping initiated ---`);
                    let response = await stopFun(url, myJob.groupId);
                    myJob.state = "STOPPED";
                    myJob.scheduleUpdatedAt = `${new Date()}`;
                    await changePermission();
                    await fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                        if (err) throw err;
                        logger.info('Restart process - Scheduled Job status changed to STOPPED - Stopped Successfully');
                    });
                    setTimeout(() => {
                        logger.info(' --- executing nifi restart shell command ----');
                        shell.exec(`sudo ${process.env.BASE_DIR}/nifi/bin/nifi.sh restart`, function (code, stdout, stderr) {
                            console.log('Exit code:', code);
                            console.log('Program output:', stdout);
                            console.log('Program stderr:', stderr);
                        });
                    }, 120000);
                    logger.info(JSON.stringify(response))
                    logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling stopping completed ---`);
                });
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
    }
}

const startFun = (url, groupId, state) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await axios.put(url, {
                id: groupId,
                state: state,
                disconnectedNodeAcknowledged: false
            });
            resolve(result.data)
        } catch (e) {
            reject(e)
        }
    })
}
const stopFun = (url, groupId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await axios.put(url, {
                id: groupId,
                state: 'STOPPED',
                disconnectedNodeAcknowledged: false
            });
            resolve(result.data)
        } catch (e) {
            reject(e)
        }
    })
}

const changePermission = async () => {
    try {
        let username = process.env.SYSTEM_USERNAME;
        username = username.replace(/\n/g, '');
        shell.exec(`sudo chown ${username}:${username} ${filePath}`);
        logger.info("File permission change succcessful");
    } catch (error) {
        logger.info(error);
    }
};