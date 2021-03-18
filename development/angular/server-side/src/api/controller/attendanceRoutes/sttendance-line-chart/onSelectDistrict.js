const router = require('express').Router();
var const_data = require('../../../lib/config');
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/distWise', auth.authController, async (req, res) => {
    try {
        logger.info('---Infra dist wise api ---');
        var mydata = [
            {
                districtId: 2402,
                districtName: "Amreli",
                attendance: [
                    {
                        month: "August",
                        attendance: 29.8
                    },
                    {
                        month: "September",
                        attendance: 45
                    }
                ]

            },
            {
                districtId: 2405,
                districtName: "Botad",
                attendance: [
                    {
                        month: "August",
                        attendance: 40.8
                    },
                    {
                        month: "September",
                        attendance: 75
                    },
                    {
                        month: "October",
                        attendance: 60
                    }
                ]

            }
        ];

        logger.info('--- Infra dist wise api response sent ---');
        res.status(200).send({ data: mydata });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;