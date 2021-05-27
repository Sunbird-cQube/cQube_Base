const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');

const axios = require('axios');
const dotenv = require('dotenv');
const Querystring = require('querystring');

dotenv.config();

var host = process.env.KEYCLOAK_HOST;
var realm = process.env.KEYCLOAK_REALM;
var client_id = process.env.KEYCLOAK_CLIENT

router.post('/:id', auth.authController, async function (req, res) {
    try {
        logger.info('---change password api ---');
        var userId = req.params.id;
        var loginUrl = `${host}/auth/realms/${realm}/protocol/openid-connect/token`
        let body = Querystring['stringify']({
            "grant_type": "password",
            "client_id": client_id,
            "username": req.body.userName,
            "password": req.body.currentPasswd
        })

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        axios.post(loginUrl, body, config)
            .then(response => {
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
            })
            .catch(error => {
                res.status(409).json({ errMsg: error.response.data.errorMessage });
            })

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;