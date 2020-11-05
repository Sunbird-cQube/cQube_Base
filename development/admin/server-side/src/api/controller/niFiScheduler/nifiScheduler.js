const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const axios = require('axios');
var schedule = require('node-schedule');
const { min } = require('moment');
const fs = require('fs');
var shell = require('shelljs');

var filePath = `${process.env.BASE_DIR}/cqube/admin_dashboard/schedulers.json`;

router.get('/getProcessorId', auth.authController, async (req, res) => {
    try {
        logger.info('--- get nifi processor group id api ---')
        let url = `${process.env.NIFI_URL}/process-groups/root`
        let getGroupId = await axios.get(url);
        logger.info('--- get nifi processor group id api response sent ---')
        res.send({ processorId: getGroupId.data.id })
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
})

router.get('/getProcessorDetails/:id', auth.authController, async (req, res) => {
    try {
        logger.info('--- get nifi processor group details api ---');
        let groupId = req.params.id
        let url = `${process.env.NIFI_URL}/flow/process-groups/${groupId}`
        let getGroupDetails = await axios.get(url);

        var groupObj = []
        let processorGroups = process.env.NIFI_PROCESSORS.split(',')
        processorGroups.forEach(groupName => {
            getGroupDetails.data.processGroupFlow.flow.processGroups.forEach(result => {
                let state
                if (result.runningCount > 0 && (result.stoppedCount == 0 && result.invalidCount == 0)) {
                    state = 'RUNNING';
                } else if (result.runningCount == 0 && (result.stoppedCount > 0 || result.invalidCount > 0)) {
                    state = 'STOPPED';
                } else if (result.runningCount > 0 && (result.stoppedCount > 0 || result.invalidCount > 0)) {
                    state = 'STOPPED'
                }
                if (result.component.name == groupName) {
                    let groupNames = {
                        id: result.id,
                        name: result.component.name,
                        state: state
                    };
                    groupObj.push(groupNames)
                }
            });
        })
        logger.info('--- get nifi processor group details api response sent ---')
        res.send(groupObj)
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/scheduleProcessor/:id', auth.authController, async (req, res) => {
    try {
        logger.info('--- schedule processor api ---')
        var schedularData = [];

        let groupId = req.params.id
        let state = req.body.state
        let hours = parseInt(req.body.time.hours);
        var mins = 0;
        if (req.body.time.minutes) {
            mins = parseInt(req.body.time.minutes);
        }

        let timeToStop = req.body.stopTime

        timeToStop = hours + timeToStop

        if (timeToStop >= 24) {
            timeToStop = timeToStop % 24;
            timeToStop = timeToStop < 0 ? 24 + timeToStop : +timeToStop;
        }

        let url = `${process.env.NIFI_URL}/flow/process-groups/${groupId}`

        var job = await schedule.scheduledJobs[groupId];

        if (job != undefined) {
            job.cancel();
            let obj = {
                groupId: groupId,
                state: state,
                mins: mins,
                hours: hours,
                timeToStop: timeToStop,
                scheduleUpdatedAt: `${new Date()}`
            }

            schedularData = JSON.parse(fs.readFileSync(filePath));
            schedularData.forEach(myJob => {
                if (myJob.groupId == obj.groupId) {
                    myJob.groupId = obj.groupId;
                    myJob.state = obj.state;
                    myJob.mins = obj.mins;
                    myJob.hours = obj.hours;
                    myJob.timeToStop = obj.timeToStop;
                    myJob.scheduleUpdatedAt = `${obj.scheduleUpdatedAt}`;
                }
            });
            fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                if (err) throw err;
                logger.info('Re-Scheduled RUNNING Job - Updated to file');
            });

            await schedule.scheduleJob(groupId, `${mins} ${hours} * * *`, async function () {
                logger.info(`--- ${groupId} - Nifi processor group re-scheduling started ---`);
                let response = await startFun()
                logger.info(JSON.stringify(response))
                logger.info(`--- ${groupId} - Nifi processor group re-scheduling completed ---`);
            });
            await schedule.scheduleJob(groupId, `${mins} ${timeToStop} * * *`, async function () {
                logger.info(`--- ${groupId} - Nifi processor group re-scheduling stopping initiated ---`);
                let response = await stopFun()
                schedularData = JSON.parse(fs.readFileSync(filePath));
                schedularData.forEach(myJob => {
                    if (myJob.groupId == obj.groupId) {
                        myJob.state = "STOPPED";
                        myJob.scheduleUpdatedAt = `${new Date()}`;
                    }
                });
                fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                    if (err) throw err;
                    logger.info('Re-Scheduled Job status changed to STOPPED - has updated to file');
                });
                setTimeout(() => {
                    shell.exec(`sudo systemctl restart nifi.service`);
                }, 120000);
                logger.info(JSON.stringify(response))
                logger.info(`--- ${groupId} - Nifi processor group re-scheduling stopping completed ---`);
            });
        } else {
            let obj = {
                groupId: groupId,
                state: state,
                mins: mins,
                hours: hours,
                timeToStop: timeToStop,
                scheduleUpdatedAt: `${new Date()}`
            }

            if (fs.existsSync(filePath)) {
                schedularData = JSON.parse(fs.readFileSync(filePath));
            }
            schedularData.push(obj);
            fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                if (err) throw err;
                logger.info('Scheduled RUNNING Job - Updated to file');
            });

            await schedule.scheduleJob(groupId, `${mins} ${hours} * * *`, async function () {
                logger.info(`--- ${groupId} - Nifi processor group scheduling started ---`);
                let response = await startFun()
                logger.info(JSON.stringify(response))
                logger.info(`--- ${groupId} - Nifi processor group scheduling completed ---`);
            });
            await schedule.scheduleJob(groupId, `${mins} ${timeToStop} * * *`, async function () {
                logger.info(`--- ${groupId} - Nifi processor group scheduling stopping initiated ---`);
                let response = await stopFun()
                schedularData = JSON.parse(fs.readFileSync(filePath));
                schedularData.forEach(myJob => {
                    if (myJob.groupId == obj.groupId) {
                        myJob.state = "STOPPED";
                        myJob.scheduleUpdatedAt = `${new Date()}`;
                    }
                });

                fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                    if (err) throw err;
                    logger.info('Scheduled Job status changed to STOPPED - has updated to file');
                });
                setTimeout(() => {
                    shell.exec(`sudo systemctl restart nifi.service`);
                }, 120000);
                logger.info(JSON.stringify(response))
                logger.info(`--- ${groupId} - Nifi processor group scheduling stopping completed ---`);
            });
        }
        const startFun = () => {
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
        const stopFun = () => {
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
        logger.info('--- schedule processor api response sent ---')
        res.send({ msg: `Job rescheduled successfully at ${req.body.time.hours}: ${req.body.time.minutes} every day` })
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
})

router.post('/scheduleNiFiProcessor/:id', async (req, res) => {
    try {
        logger.info('--- schedule processor api ---')
        var schedularData = [];

        let groupId = req.params.id
        let state = req.body.state
        let hours = parseInt(req.body.time.hours);
        var mins = 00;
        if (req.body.time.minutes) {
            mins = parseInt(req.body.time.minutes);
        }
        let timeToStop = req.body.stopTime

        timeToStop = hours + timeToStop

        if (timeToStop >= 24) {
            timeToStop = timeToStop % 24;
            timeToStop = timeToStop < 0 ? 24 + timeToStop : +timeToStop;
        }

        let url = `${process.env.NIFI_URL}/flow/process-groups/${groupId}`

        var job = await schedule.scheduledJobs[groupId];

        if (job != undefined) {
            job.cancel();
            let obj = {
                groupId: groupId,
                state: state,
                mins: mins,
                hours: hours,
                timeToStop: timeToStop,
                scheduleUpdatedAt: `${new Date()}`
            }

            schedularData = JSON.parse(fs.readFileSync(filePath));
            schedularData.forEach(myJob => {
                if (myJob.groupId == obj.groupId) {
                    myJob.groupId = obj.groupId;
                    myJob.state = obj.state;
                    myJob.mins = obj.mins;
                    myJob.hours = obj.hours;
                    myJob.timeToStop = obj.timeToStop;
                    myJob.scheduleUpdatedAt = `${obj.scheduleUpdatedAt}`;
                }
            });
            fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                if (err) throw err;
                logger.info('Re-Scheduled RUNNING Job - Updated to file');
            });

            await schedule.scheduleJob(groupId, `${mins} ${hours} * * *`, async function () {
                logger.info(`--- ${groupId} - Nifi processor group re-scheduling started ---`);
                let response = await startFun()
                logger.info(JSON.stringify(response))
                logger.info(`--- ${groupId} - Nifi processor group re-scheduling completed ---`);
            });
            await schedule.scheduleJob(groupId, `${mins} ${timeToStop} * * *`, async function () {
                logger.info(`--- ${groupId} - Nifi processor group re-scheduling stopping initiated ---`);
                let response = await stopFun()
                schedularData = JSON.parse(fs.readFileSync(filePath));
                schedularData.forEach(myJob => {
                    if (myJob.groupId == obj.groupId) {
                        myJob.state = "STOPPED";
                        myJob.scheduleUpdatedAt = `${new Date()}`;
                    }
                });
                fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                    if (err) throw err;
                    logger.info('Re-Scheduled Job status changed to STOPPED - has updated to file');
                });
                setTimeout(() => {
                    shell.exec(`sudo systemctl restart nifi.service`);
                }, 120000);
                logger.info(JSON.stringify(response))
                logger.info(`--- ${groupId} - Nifi processor group re-scheduling stopping completed ---`);
            });
        } else {
            let obj = {
                groupId: groupId,
                state: state,
                mins: mins,
                hours: hours,
                timeToStop: timeToStop,
                scheduleUpdatedAt: `${new Date()}`
            }

            if (fs.existsSync(filePath)) {
                schedularData = JSON.parse(fs.readFileSync(filePath));
            }
            schedularData.push(obj);
            fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                if (err) throw err;
                logger.info('Scheduled RUNNING Job - Updated to file');
            });

            await schedule.scheduleJob(groupId, `${mins} ${hours} * * *`, async function () {
                logger.info(`--- ${groupId} - Nifi processor group scheduling started ---`);
                let response = await startFun()
                logger.info(JSON.stringify(response))
                logger.info(`--- ${groupId} - Nifi processor group scheduling completed ---`);
            });
            await schedule.scheduleJob(groupId, `${mins} ${timeToStop} * * *`, async function () {
                logger.info(`--- ${groupId} - Nifi processor group scheduling stopping initiated ---`);
                let response = await stopFun()
                schedularData = JSON.parse(fs.readFileSync(filePath));
                schedularData.forEach(myJob => {
                    if (myJob.groupId == obj.groupId) {
                        myJob.state = "STOPPED";
                        myJob.scheduleUpdatedAt = `${new Date()}`;
                    }
                });

                fs.writeFile(filePath, JSON.stringify(schedularData), function (err) {
                    if (err) throw err;
                    logger.info('Scheduled Job status changed to STOPPED - has updated to file');
                });
                setTimeout(() => {
                    shell.exec(`sudo systemctl restart nifi.service`);
                }, 120000);
                logger.info(JSON.stringify(response))
                logger.info(`--- ${groupId} - Nifi processor group scheduling stopping completed ---`);
            });
        }
        const startFun = () => {
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
        const stopFun = () => {
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
        logger.info('--- schedule processor api response sent ---')
        res.send({ msg: `Job rescheduled successfully at ${req.body.time.hours}: ${req.body.time.minutes} every day` })
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
})

module.exports = router;