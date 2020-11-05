const { logger } = require('../../lib/logger');
var schedule = require('node-schedule');
const fs = require('fs');
const axios = require('axios');
var filePath = `${process.env.BASE_DIR}/cqube/admin_dashboard/schedulers.json`;

exports.restartNifiProcess = async function () {
    var schedularData = []
    if (fs.existsSync(filePath)) {
        schedularData = JSON.parse(fs.readFileSync(filePath));
    }
    await schedularData.forEach(async myJob => {
        if (myJob.state == "RUNNING") {
            await schedule.scheduleJob(myJob.groupId, `${mins} ${hours} * * *`, async function () {
                logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling started ---`);
                let response = await startFun();
                myJob.scheduleUpdatedAt = `${new Date()}`;
                await fs.writeFile("../schedulers.json", JSON.stringify(schedularData), function (err) {
                    if (err) throw err;
                    logger.info('Restart process - Scheduled RUNNING Job - Restarted successfully');
                });
                setTimeout(() => {
                    shell.exec(`sudo systemctl restart nifi.service`);
                }, 120000);
                logger.info(JSON.stringify(response))
                logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling completed ---`);
            });
            await schedule.scheduleJob(myJob.groupId, `${mins} ${timeToStop} * * *`, async function () {
                logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling stopping initiated ---`);
                let response = await stopFun();
                myJob.state = "STOPPED";
                myJob.scheduleUpdatedAt = `${new Date()}`;
                await fs.writeFile("../schedulers.json", JSON.stringify(schedularData), function (err) {
                    if (err) throw err;
                    logger.info('Restart process - Scheduled Job status changed to STOPPED - Stopped Successfully');
                });
                setTimeout(() => {
                    shell.exec(`sudo systemctl restart nifi.service`);
                }, 120000);
                logger.info(JSON.stringify(response))
                logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling stopping completed ---`);
            });
        }
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