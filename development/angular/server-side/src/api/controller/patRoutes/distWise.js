const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT dist wise api ---');
        let fileName = `pat/pat_district.json`
        var districtData = await s3File.readS3File(fileName);

        // var districtData = {
        //     "data": [
        //         {
        //             "pat_scores": {
        //                 "Grade 8": 50.73,
        //                 "School Performance": 52.75,
        //                 "Grade 5": 54.2,
        //                 "Grade 3": 61.94,
        //                 "Grade 6": 42.92,
        //                 "Grade 4": 56.72,
        //                 "Grade 7": 49.42,
        //                 "academic_year": "2020-21"
        //             },
        //             "details": {
        //                 "latitude": 22.477627778,
        //                 "longitude": 72.873763889,
        //                 "district_id": 2415,
        //                 "district_name": "ANAND",
        //                 "students_count": "68387",
        //                 "total_schools": "630"
        //             },
        //             "grades": {
        //                 "grade3": {
        //                     "Maths": 43.54,
        //                     "Science": 23.53,
        //                     "OverAll": 61.94
        //                 },
        //                 "grade4": {
        //                     "Social": 15.54,
        //                     "English": 67.53,
        //                     "OverAll": 50.05
        //                 }
        //             }
        //         }
        //     ],
        //     AllDistrictsFooter: {
        //         total_schools: 100,
        //         students_count: 2000

        //     }
        // }
        var mydata = districtData.data;

        logger.info('--- PAT dist wise api response sent ---');
        res.status(200).send({ data: mydata, footer: districtData.AllDistrictsFooter });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;