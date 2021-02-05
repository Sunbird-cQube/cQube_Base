const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/allDistrictWise', auth.authController, async (req, res) => {
    try {
        logger.info('--- pat exception district api ---');
        var timePeriod = req.body.timePeriod;
        var grade = req.body.grade;
        let fileName;
        if (grade && grade != 'all') {
            fileName = `exception_list/pat_exception/grade/${timePeriod}/district/${grade}.json`
        } else {
            fileName = `exception_list/pat_exception/${timePeriod}/district.json`
        }
        var districtData = await s3File.readS3File(fileName);
        // console.log(districtData);
        var Subjects = [];
        if (districtData) {
            var sortedData = districtData['data'].sort((a, b) => (a.district_name) > (b.district_name) ? 1 : -1);
            if (grade && grade != 'all') {
                sortedData.map(item => {
                    Object.keys(item.subjects[0]).map(key => {
                        Subjects.push(key);
                    })
                });
                Subjects = [...new Set(Subjects)];
            }
            logger.info('--- pat exception district api response sent ---');
            res.status(200).send({ data: sortedData, footer: districtData.allDistrictsFooter.total_schools_with_missing_data, subjects: grade && grade != 'all' ? Subjects : [] });
        } else {
            logger.info('--- pat exception district api response sent ---');
            res.status(403).json({ errMsg: "Data not found" });
        }

    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router