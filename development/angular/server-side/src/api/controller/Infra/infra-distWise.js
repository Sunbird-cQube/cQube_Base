const router = require('express').Router();
var const_data = require('../../lib/config');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const fs = require('fs');
router.post('/distWise', function (req, res) {
    try {
        logger.info('---Infra dist wise api ---');
        // var month = req.body.month;
        // var year = req.body.year;
        // const_data['getParams']['Key'] = `infrastructure/infra_sample .json`;
        // const_data['s3'].getObject(const_data['getParams'], function (err, data) {
        //     if (err) {
        //         logger.error(err);
        //         res.status(500).json({ errMsg: "Something went wrong" });
        //     } else if (!data) {
        //         logger.error("No data found in s3 file");
        //         res.status(403).json({ errMsg: "No such data found" });
        //     } else {
        //         logger.info('--- Infra dist wise api response sent ---');

        //     }
        // });
        var data = [
            {
                "district": {
                    "name": "Districts",
                    "value": "NARMADA"
                },
                "block": {
                    "name": "Blocks",
                    "value": "ABC"
                },
                "total_schools": {
                    "name": "Total Schools",
                    "value": 212
                },
                "data_received": {
                    "name": "Data Received",
                    "value": 174
                },
                "infra_score": {
                    "name": "Infrastructure score",
                    "value": 3
                },
                "average": {
                    "name": "Average on 19 parameters (%)",
                    "value": 168,
                    "percent": 96.52
                },
                "handwash": {
                    "name": "Handwash (%)",
                    "value": 173,
                    "percent": 99.43
                },
                "solarPanel": {
                    "name": "Solar Panel (%)",
                    "value": 170,
                    "percent": 97.7
                }
            },
            {
                "district": {
                    "name": "Districts",
                    "value": "SABAR KANTHA"
                },
                "block": {
                    "name": "Blocks",
                    "value": "DEF"
                },
                "total_schools": {
                    "name": "Total Schools",
                    "value": 579
                },
                "data_received": {
                    "name": "Data Received",
                    "value": 558
                },
                "infra_score": {
                    "name": "Infrastructure score",
                    "value": 5
                },
                "average": {
                    "name": "Average on 19 parameters (%)",
                    "value": 553,
                    "percent": 99.04
                },
                "handwash": {
                    "name": "Handwash (%)",
                    "value": 553,
                    "percent": 99.1
                },
                "solarPanel": {
                    "name": "Solar Panel (%)",
                    "value": 553,
                    "percent": 99.1
                }
            },
            {
                "district": {
                    "name": "Districts",
                    "value": "VADODARA"
                },
                "block": {
                    "name": "Blocks",
                    "value": "GHI"
                },
                "total_schools": {
                    "name": "Total Schools",
                    "value": 504
                },
                "data_received": {
                    "name": "Data Received",
                    "value": 484
                },
                "infra_score": {
                    "name": "Infrastructure score",
                    "value": 10
                },
                "average": {
                    "name": "Average on 19 parameters (%)",
                    "value": 479,
                    "percent": 98.98
                },
                "handwash": {
                    "name": "Handwash (%)",
                    "value": 483,
                    "percent": 99.79
                },
                "solarPanel": {
                    "name": "Solar Panel (%)",
                    "value": 482,
                    "percent": 99.59
                }
            }
        ]
        logger.info('---Infra dist wise response sent---');
        res.status(200).send(data);
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;