const { logger } = require('../../lib/logger');
var schedule = require('node-schedule');
const fs = require('fs');
const axios = require('axios');
var filePath = `${process.env.BASE_DIR}/cqube/admin_dashboard/schedulers.json`;
var shell = require('shelljs');

exports.restartNifiProcess = async function () {
    try {
        var schedulerTime;
        var schedularData = []
        if (fs.existsSync(filePath)) {
            await changePermission();
            schedularData = JSON.parse(fs.readFileSync(filePath));
            schedularData.forEach(async (myJob, index) => {
                if (myJob.day && myJob.day != "*") {
                    schedulerTime = `${myJob.mins} ${myJob.hours} * * ${myJob.day}`;
                } else if (myJob.date && myJob.date != "*") {
                    schedulerTime = `${myJob.mins} ${myJob.hours} ${myJob.date} * *`;
                } else if (myJob.date && myJob.date != "*" && myJob.month && myJob.month != "*") {
                    schedulerTime = `${myJob.mins} ${myJob.hours} ${myJob.date} ${myJob.month} *`;
                } else {
                    schedulerTime = `${myJob.mins} ${myJob.hours} * * *`;
                }

                logger.info('Rescheduling jobs due to nodejs restart');
                if(myJob.state == "RUNNING"){
                   await stoppingJob(myJob, schedularData);
                }
                await rescheduleJob(myJob, schedulerTime, schedularData);
                await stoppingJob(myJob, schedularData);
            });
        }
    } catch (e) {
        logger.error(`Error :: ${e}`);
    }
}

const rescheduleJob = (myJob, schedulerTime, schedularData) => {
    return new Promise(async (resolve, reject) => {
        try {
            await schedule.scheduleJob(myJob.groupName + '_start', schedulerTime, async function () {
                var processorsList = await axios.get(`${process.env.NIFI_URL}/process-groups/root/process-groups`);
                processorsList.data.processGroups.map(process => {
                    if (myJob.groupName == process.component.name) {
                        myJob.groupId = process.component.id;
                    }
                })
                let url = `${process.env.NIFI_URL}/flow/process-groups/${myJob.groupId}`;
                logger.info(`--- ${myJob.groupName} - Nifi processor group scheduling started ---`);
                let response = await startFun(url, myJob.groupId, "RUNNING");
                myJob.state = "RUNNING";
                myJob.scheduleUpdatedAt = `${new Date()}`;
                await fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                    if (err) throw err;
                    logger.info('Restart process - Scheduled RUNNING Job - Restarted successfully');
                    resolve(true);
                });
                logger.info(JSON.stringify(response))
                logger.info(`--- ${myJob.groupName} - Nifi processor group scheduling completed ---`);
            });
        } catch (e) {
            reject(e);
        }
    })
}

const stoppingJob = (myJob, schedularData) => {
    return new Promise(async (resolve, reject) => {
        try {
            var stopTime;
            if (myJob.day && myJob.day != "*") {
                stopTime = `${myJob.mins} ${myJob.timeToStop} * * ${myJob.day}`;
            } else if (myJob.date && myJob.date != "*") {
                stopTime = `${myJob.mins} ${myJob.timeToStop} ${myJob.date} * *`;
            } else if (myJob.date && myJob.date != "*" && myJob.month && myJob.month != "*") {
                stopTime = `${myJob.mins} ${myJob.timeToStop} ${myJob.date} ${myJob.month} *`;
            } else {
                stopTime = `${myJob.mins} ${myJob.timeToStop} * * *`;
            }
            await schedule.scheduleJob(myJob.groupName + '_stop', stopTime, async function () {

                var processorsList = await axios.get(`${process.env.NIFI_URL}/process-groups/root/process-groups`);
                processorsList.data.processGroups.map(process => {
                    if (myJob.groupName == process.component.name) {
                        myJob.groupId = process.component.id;
                    }
                })
                let url = `${process.env.NIFI_URL}/flow/process-groups/${myJob.groupId}`;
                logger.info(`--- ${myJob.groupName} - Nifi processor group scheduling stopping initiated ---`);
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
                    shell.exec(`sudo ${process.env.BASE_DIR}/cqube/nifi/nifi/bin/nifi.sh restart`, function (code, stdout, stderr) {
                        logger.info('Exit code:', code);
                        logger.info('Program output:', stdout);
                        logger.info('Program stderr:', stderr);
                    });
                    resolve("Restart process - Job has been Stopped");
                }, 120000);
                logger.info(JSON.stringify(response))
                logger.info(`--- ${myJob.groupName} - Nifi processor group scheduling stopping completed ---`);
            });

        } catch (e) {
            reject(e);
        }
    })
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