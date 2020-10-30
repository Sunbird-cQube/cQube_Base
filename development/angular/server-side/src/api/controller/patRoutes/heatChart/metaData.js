const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');
const helper = require('./helper');

router.post('/metaData', async (req, res) => {
    try {
        logger.info('---PAT meta data api ---');

        var data = {
            "years": [
                {
                    year: 2019
                },
                {
                    year: 2020
                }
            ],
            "grades": [
                {
                    grade: "3"
                },
                {
                    grade: "4"
                },
                {
                    grade: "5"
                }
            ],
            "subjects": [
                {
                    subject: "Maths"
                },
                {
                    subject: "Science"
                },
                {
                    subject: "Hindi"
                },
                {
                    subject: "Gujarati"
                }
            ],
            "examDate": [
                {
                    date: "27-09-2019"
                },
                {
                    date: "28-09-2019"
                },
                {
                    date: "24-08-2019"
                }
            ],
            "viewBy": [
                { key: "indicator_id", value: "Question Id" },
                { key: "indicator", value: "Indicator" }
            ]
        }

        logger.info('--- PAT meta data response sent ---');
        res.status(200).send({ data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router