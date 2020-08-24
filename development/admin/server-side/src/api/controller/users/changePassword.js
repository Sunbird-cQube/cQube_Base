const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

const axios = require('axios');
const qs = require('querystring');
const dotenv = require('dotenv');
dotenv.config();

var requestData = {
    username: process.env.KEYCLOAK_USER,
    password: process.env.PASSWORD,
    grant_type: process.env.GRANT_TYPE,
    client_id: process.env.CLIENT_ID
}

var host = process.env.KEYCLOAK_HOST;
var realm = process.env.KEYCLOAK_REALM;

router.post('/:id', auth.authController, async function (req, res) {
    try {
        logger.info('---change password api ---');

        var url = `${host}/auth/realms/master/protocol/openid-connect/token`;
        var response = await axios.post(url, qs.stringify(requestData), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        var access_token = response.data.access_token;
        var userId = req.params.id;

        var usersUrl = `${host}/auth/admin/realms/${realm}/users/${userId}/reset-password`;
        var headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer" + " " + access_token
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