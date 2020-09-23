const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---PAT dist wise api ---');
        let fileName = `pat/pat_district.json`

        var districtData = {}
        if (req.body.data) {
            districtData = {
                "data": [{
                    "subjects": {
                        "Maths": 43.54,
                        "Science": 23.53,
                        "Performance": 23.67
                    },
                    "Details": {
                        "latitude": 22.477627778,
                        "longitude": 72.873763889,
                        "district_id": 2415,
                        "district_name": "ANAND",
                        "students_count": "68387",
                        "total_schools": "630"
                    }
                }, {
                    "subjects": {
                        "Maths": 42.54,
                        "Science": 22.53,
                        "Performance": 25.67
                    },
                    "Details": {
                        "latitude": 21.477627778,
                        "longitude": 73.873763889,
                        "district_id": 2401,
                        "district_name": "Ahemdabad",
                        "students_count": "68387",
                        "total_schools": "630"
                    }
                }],
                AllDistrictsFooter: {
                    total_schools: 50,
                    students_count: 200

                }
            }
        } else {
            districtData = await s3File.readS3File(fileName);
        }
        var mydata = districtData.data;

        logger.info('--- PAT dist wise api response sent ---');
        res.status(200).send({ data: mydata, footer: districtData.AllDistrictsFooter });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

router.get('/grades', (req, res, next) => {
    try {
        logger.info('---grades metadata api ---');
        var mydata = {
            "district": [
                {
                    "grade": "Grade 3"
                },
                {
                    "grade": "Grade 4"
                },
                {
                    "grade": "Grade 5"
                }
            ],
            "block": [
                {
                    "grade": "Grade 3"
                },
                {
                    "grade": "Grade 4"
                },
                {
                    "grade": "Grade 5"
                }
            ],
            "cluster": [
                {
                    "grade": "Grade 3"
                },
                {
                    "grade": "Grade 4"
                },
                {
                    "grade": "Grade 5"
                }
            ],
            "school": [
                {
                    "grade": "Grade 3"
                },
                {
                    "grade": "Grade 4"
                },
                {
                    "grade": "Grade 5"
                }
            ]
        }
        logger.info('---grades metadata api response sent---');
        res.status(200).send({ data: mydata });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
})

module.exports = router;