const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/dikshaAllData', async (req, res) => {
    try {
        logger.info('--- diksha all data api ---');
        var timePeriod = req.body.timePeriod;
        let fileName = `diksha/stack_bar_reports/${timePeriod}/All.json`
        var data = await s3File.readS3File(fileName);
        let funRes = await getData(data['All'][req.body.login_type])
        res.status(200).send(funRes)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/dikshaData', async (req, res) => {
    try {
        logger.info('--- diksha all data api ---');
        let fileName = ''
        if (req.body.timePeriod != '') {
            fileName = `diksha/stack_bar_reports/${req.body.timePeriod}/${req.body.districtId}.json`
        } else {
            fileName = `diksha/stack_bar_reports/${req.body.districtId}.json`
        }
        console.log(fileName);
        var data = await s3File.readS3File(fileName);
        if (data[req.body.districtId][req.body.login_type]) {
            let funRes = await getData(data[req.body.districtId][req.body.login_type])
            logger.info('--- dikshaData api response sent ---');
            res.status(200).send(funRes)
        } else {
            logger.info('--- dikshaData api no data found response sent ---');
            res.send({ msg: "No data found" })
        }


    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});


router.get('/dikshaMetaData', async (req, res) => {
    try {
        logger.info('--- dikshaMetaData api ---');
        let fileName = `diksha/table_reports/diksha_metadata.json`
        var tableData = await s3File.readS3File(fileName);
        if (tableData.districtDetails != null) {
            var sortedData = tableData.districtDetails.sort((a, b) => (a.district_name) > (b.district_name) ? 1 : -1)
            tableData['districtDetails'] = sortedData
        }
        logger.info('--- dikshaMetaData api response sent ---');
        res.send(tableData)
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

const getData = async (filterData) => {
    return new Promise((resolve, reject) => {
        try {
            let gradeData = {}

            Promise.all([filterData.map(item => {
                if (gradeData.hasOwnProperty(item.content_gradelevel))
                    gradeData[item.content_gradelevel].push(item)
                else
                    gradeData[item.content_gradelevel] = [item]
            })]).then(() => {
                let subData = []
                Promise.all(filterData.map((item, index) => {
                    if (subData.indexOf(item.content_subject) == -1)
                        subData.push(item.content_subject)
                })).then(() => {
                    Promise.all(subData.map(subItem => {
                        return Promise.all(Object.keys(gradeData).map(gradItem => {
                            let filteredGrade = gradeData[gradItem].filter(filterItem => subItem === filterItem.content_subject)
                            let total = filteredGrade.reduce((accumulator, currentValue) => {
                                return currentValue.total_count
                                // return `${(currentValue.total_count / 10 * 100).toFixed(0)}%`;
                            }, 0)
                            return total;
                        })).then(totalCountArray => {
                            return {
                                subject: subItem,
                                score: totalCountArray
                            }
                        })
                    })).then(totalSubject => {
                        resolve({
                            grades: Object.keys(gradeData),
                            data: totalSubject
                        })
                    })
                })
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

router.post('/dikshaDataDownload', async (req, res) => {
    try {
        logger.info('--- diksha all data api ---');
        var timePeriod = req.body.timePeriod;
        var districtId = req.body.districtId;
        var data;
        if (districtId == '' && timePeriod != '') {
            let fileName = `diksha/stack_bar_reports/${timePeriod}/All.json`;
            data = await s3File.readS3File(fileName);
            res.status(200).send(data);
        } else {
            let fileName = `diksha/stack_bar_reports/${timePeriod}/${districtId}.json`;
            data = await s3File.readS3File(fileName);
            res.status(200).send(data);
        }

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;