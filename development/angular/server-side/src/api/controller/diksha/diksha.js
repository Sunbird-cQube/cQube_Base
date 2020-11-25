const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/dikshaAllData', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha all data api ---');
        var timePeriod = req.body.timePeriod;
        let fileName = `diksha/stack_bar_reports/${timePeriod}/All.json`
        var data = await s3File.readS3File(fileName);
        var footer = data['footer'];
        let a = []
        data.data['All'][req.body.login_type].forEach(element => {
            if (element.content_gradelevel == 'Class 1') {
                element['content_gradelevel'] = 'Class  1'
            }
            if (element.content_gradelevel == 'Class 2') {
                element['content_gradelevel'] = 'Class  2'
            }
            if (element.content_gradelevel == 'Class 3') {
                element['content_gradelevel'] = 'Class  3'
            }
            if (element.content_gradelevel == 'Class 4') {
                element['content_gradelevel'] = 'Class  4'
            }
            if (element.content_gradelevel == 'Class 5') {
                element['content_gradelevel'] = 'Class  5'
            }
            if (element.content_gradelevel == 'Class 6') {
                element['content_gradelevel'] = 'Class  6'
            }
            if (element.content_gradelevel == 'Class 7') {
                element['content_gradelevel'] = 'Class  7'
            }
            if (element.content_gradelevel == 'Class 8') {
                element['content_gradelevel'] = 'Class  8'
            }
            if (element.content_gradelevel == 'Class 9') {
                element['content_gradelevel'] = 'Class  9'
            }
            a.push(element)
        });
        data = a.sort((a, b) => (a.content_gradelevel) > (b.content_gradelevel) ? 1 : -1)
        let funRes = await getData(data)
        res.status(200).send({ funRes, footer: footer.total_content_plays });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.post('/dikshaData', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha district & time range data api ---');
        let fileName = ''
        if (req.body.timePeriod) {
            fileName = `diksha/stack_bar_reports/${req.body.timePeriod}/${req.body.districtId}.json`
        } else {
            fileName = `diksha/stack_bar_reports/${req.body.districtId}.json`
        }
        var data = await s3File.readS3File(fileName);
        var footer = data['footer'];
        if (data.data[req.body.districtId][req.body.login_type]) {
            let a = [];
            data = data.data[req.body.districtId][req.body.login_type];
            data.forEach(element => {
                if (element.content_gradelevel == 'Class 1') {
                    element['content_gradelevel'] = 'Class  1'
                }
                if (element.content_gradelevel == 'Class 2') {
                    element['content_gradelevel'] = 'Class  2'
                }
                if (element.content_gradelevel == 'Class 3') {
                    element['content_gradelevel'] = 'Class  3'
                }
                if (element.content_gradelevel == 'Class 4') {
                    element['content_gradelevel'] = 'Class  4'
                }
                if (element.content_gradelevel == 'Class 5') {
                    element['content_gradelevel'] = 'Class  5'
                }
                if (element.content_gradelevel == 'Class 6') {
                    element['content_gradelevel'] = 'Class  6'
                }
                if (element.content_gradelevel == 'Class 7') {
                    element['content_gradelevel'] = 'Class  7'
                }
                if (element.content_gradelevel == 'Class 8') {
                    element['content_gradelevel'] = 'Class  8'
                }
                if (element.content_gradelevel == 'Class 9') {
                    element['content_gradelevel'] = 'Class  9'
                }
                a.push(element)
            });
            data = a.sort((a, b) => (a.content_gradelevel) > (b.content_gradelevel) ? 1 : -1)
            let funRes = await getData(data)
            logger.info('--- dikshaData district & time range api response sent ---');
            res.status(200).send({ funRes, footer: footer.total_content_plays })
        } else {
            logger.info('--- dikshaData district & time range api no data found response sent ---');
            res.status(403).send({ errMsg: "No data found" })
        }
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.get('/dikshaMetaData', auth.authController, async (req, res) => {
    try {
        logger.info('--- dikshaMetaData api ---');
        let fileName = `diksha/stack_bar_reports/diksha_metadata.json`;
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
                                return currentValue.total_content_plays
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

router.post('/dikshaDataDownload', auth.authController, async (req, res) => {
    try {
        logger.info('--- diksha all data api ---');
        var timePeriod = req.body.timePeriod;
        var districtId = req.body.districtId;
        var data;
        if (districtId == '' && timePeriod != '') {
            let fileName = `diksha/stack_bar_reports/${timePeriod}/All.json`;
            data = await s3File.readS3File(fileName);
            res.status(200).send(data.data);
        } else {
            let fileName = `diksha/stack_bar_reports/${timePeriod}/${districtId}.json`;
            data = await s3File.readS3File(fileName);
            res.status(200).send(data.data);
        }

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;