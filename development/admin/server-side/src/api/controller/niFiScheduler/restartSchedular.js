const { logger } = require('../../lib/logger');
var schedule = require('node-schedule');
const fs = require('fs');

exports.restartNifiProcess = async function () {
    var schedularData = JSON.parse(fs.readFileSync('schedulers.json'));
    await schedularData.forEach(async myJob => {
        if (myJob.state == "RUNNING") {
            await schedule.scheduleJob(myJob.groupId, `${myJob.mins}  ${myJob.hours} * * *`, async function () {
                // logger.info(`schedule processor ${groupId} for default time ::::::: ${hours} : ${mins}`);
                logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling started ---`);
                let response = await startFun();

                myJob.updateDateTime = `${new Date()}`;
                await fs.writeFile("schedulers.json", JSON.stringify(schedularData), function (err) {
                    if (err) throw err;
                    console.log('Scheduled Job Updated');
                });

                logger.info(JSON.stringify(response))
                logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling completed ---`);
            });
            await schedule.scheduleJob(myJob.groupId, `${myJob.mins} ${myJob.timeToStop} * * *`, async function () {
                // logger.info(`schedule processor ${groupId} stop time ::::::: ${timeToStop} : ${mins}`);
                logger.info(`--- ${myJob.groupId} - Nifi processor group scheduling stopping initiated ---`);
                let response = await stopFun();

                myJob.state = "STOPPED";
                myJob.updateDateTime = `${new Date()}`;
                await fs.writeFile("schedulers.json", JSON.stringify(schedularData), function (err) {
                    if (err) throw err;
                    console.log('Scheduled Job Updated');
                });

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