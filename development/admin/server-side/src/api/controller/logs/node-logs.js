const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { logger } = require('../../lib/logger');
var const_data = require('../../lib/config');
var fs = require('fs');
var filePath = '/home/dheeraj/Documents/cQube_Project/cQube/development/admin/server-side/logs.txt';

router.get('/', function (req, res) {
    try {
        logger.info('---logs api ---');
        var logs = fs.readFileSync(filePath);
        res.json(logs.toString());

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;