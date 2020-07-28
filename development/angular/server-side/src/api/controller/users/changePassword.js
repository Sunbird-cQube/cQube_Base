const router = require('express').Router();
const bcrypt = require('bcrypt');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const dotenv = require('dotenv');
dotenv.config();



const keycloakHost = process.env.KEYCLOAK_HOST;
const realmName = process.env.KEYCLOAK_REALM;

var const_data = require('../../lib/config');
const s3File = require('../../lib/reads3File');

const axios = require('axios');
const qs = require('querystring')

var requestData = {
    username: "dheeraj8008tiwari",
    password: "Baba@8008",
    grant_type: "password",
    client_id: "admin-cli"
}

router.post('/', async function (req, res) {
    try {
        var url = `http://localhost:8080/auth/realms/master/protocol/openid-connect/token`;
        axios.post(url, qs.stringify(requestData), { headers: { "Content-Type": "application/x-www-form-urlencoded" } }).then((response) => {
            res.status(200).json({ auth_token: response.data });
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;