const request = require("request");
const dotenv = require('dotenv');
const { log } = require("winston");
dotenv.config();

const keycloakHost = process.env.KEYCLOAK_HOST;
const keycloakPort = process.env.KEYCLOAK_PORT;
const realmName = process.env.KEYCLOAK_REALM;

// check each request for a valid bearer token
exports.authController = (req, res, next) => {
    // assumes bearer token is passed as an authorization header
    if (req.headers.token) {
        // configure the request to your keycloak server
        const options = {
            method: 'GET',
            url: `http://${keycloakHost}:${keycloakPort}/auth/realms/${realmName}/protocol/openid-connect/userinfo`,
            headers: {
                // add the token you received to the userinfo request, sent to keycloak
                Authorization: req.headers.token
            },
        };

        // send a request to the userinfo endpoint on keycloak
        request(options, (error, response, body) => {
            if (error) throw new Error(error);

            // if the request status isn't "OK", the token is invalid
            if (response.statusCode !== 200) {
                res.status(401).json({
                    error: `unauthorized`,
                });
            }
            // the token is valid pass request onto your next function
            else {
                next();
            }
        });
    } else {
        // there is no token, don't process request further
        res.status(401).json({ error: `unauthorized` });
    }
};