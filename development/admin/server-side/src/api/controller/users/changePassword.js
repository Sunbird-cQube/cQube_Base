const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

var host = process.env.KEYCLOAK_HOST;
var realm = process.env.KEYCLOAK_REALM;

router.post('/:id', auth.authController, async function (req, res) {
    try {
        logger.info('---change password api ---');
        var userId = req.params.id;

        var usersUrl = `${host}/auth/admin/realms/${realm}/users/${userId}/reset-password`;
        var headers = {
            "Content-Type": "application/json",
            "Authorization": req.headers.token
        }
        var newPass = {
            type: "password",
            value: req.body.cnfpass,
            temporary: false
        };

        axios.put(usersUrl, newPass, { headers: headers }).then(resp => {
            res.status(201).json({ msg: "Password changed" });
        }).catch(error => {
            res.status(409).json({ errMsg: error.response.data.errorMessage });
        })
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;