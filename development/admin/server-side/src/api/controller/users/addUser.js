const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const axios = require('axios');
const qs = require('querystring');
var jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

var host = process.env.KEYCLOAK_HOST;
var realm = process.env.KEYCLOAK_REALM;

router.post('/', auth.authController, async function (req, res) {
    try {
        logger.info('---Create user api ---');

        var usersUrl = `${host}/auth/admin/realms/${realm}/users`;
        var headers = {
            "Content-Type": "application/json",
            "Authorization": req.headers.token
        }

        var userDetails = {
            username: req.body.username,
            credentials: [
                {
                    type: "password",
                    value: req.body.cnfpass,
                    temporary: false
                }
            ],
            enabled: "true"
        };

        axios.post(usersUrl, userDetails, { headers: headers }).then(resp => {
            res.status(201).json({ msg: "User Created" });
        }).catch(error => {
            res.status(409).json({ errMsg: error.response.data.errorMessage });
        })


    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }

});

router.post('/getAllUsers', auth.authController, async (req, res) => {
    try {
        logger.info('---get all user api ---');

        var usersUrl = `${host}/auth/admin/realms/${realm}/users`;
        var headers = {
            "Content-Type": "application/json",
            "Authorization": req.headers.token
        }

        var users = await axios.get(usersUrl, { headers: headers });
        var user = users.data.find(o => o.username == req.body.username.toLowerCase());

        logger.info('---get all user api response sent---');

        res.status(200).json({ id: user.id });

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
})

router.post('/setRoles', auth.authController, async (req, res) => {
    try {
        logger.info('---set roles api ---');

        var userId = req.body.userId;
        var headers = {
            "Content-Type": "application/json",
            "Authorization": req.headers.token
        }

        // check the default required actions enable for keycloak
        var actionsUrl = `${host}/auth/admin/realms/${realm}/authentication/required-actions`;

        await axios.get(actionsUrl, { headers: headers }).then(async actions => {
            // take only CONFIGURE_TOTP to check for two factor auth enable for the application
            let requiredActions = actions.data.filter(data => {
                return data.alias == 'CONFIGURE_TOTP'
            })
            // api to update the user 
            var updateUser = `${host}/auth/admin/realms/${realm}/users/${userId}`
            var actionsRequired = {
                requiredActions: [''],
            }
            // api to assign the role to user
            var usersUrl = `${host}/auth/admin/realms/${realm}/users/${userId}/role-mappings/realm`;

            var roleDetails = [
                {
                    id: req.body.role.id,
                    name: req.body.role.name
                }
            ];
            // check for required actions configured -- CONFIGURE_TOTP and update the user for two factor auth
            if (requiredActions[0].alias == 'CONFIGURE_TOTP' && requiredActions[0].enabled == true) {
                // assign two factor auth only for admin and report_viewer roles not for emission user
                if (req.body.role.name != 'emission') {
                    actionsRequired.requiredActions.push('CONFIGURE_TOTP')
                }
                // updating user api call
                axios.put(updateUser, actionsRequired, { headers: headers }).then(async resp1 => {
                    // assigning roles to user api call                    
                    await axios.post(usersUrl, roleDetails, { headers: headers }).then(async resp => {
                        res.status(200).json({ msg: "Role assigned & configured otp" });
                    }).catch(error => {
                        res.status(409).json({ errMsg: error.response.data.errorMessage });
                    })
                }).catch(error => {
                    res.status(409).json({ errMsg: error.response.data.errorMessage });
                })
            } else {
                // default if required actions not configured
                await axios.post(usersUrl, roleDetails, { headers: headers }).then(resp => {
                    res.status(200).json({ msg: "Role assigned" });
                }).catch(error => {
                    res.status(409).json({ errMsg: error.response.data.errorMessage });
                })
            }
        }).catch(error => {
            res.status(409).json({ errMsg: error.response });
        })
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.get('/roles', auth.authController, async (req, res) => {
    try {
        logger.info('---get roles api ---');
        var usersUrl = `${host}/auth/admin/realms/${realm}/roles`;
        var headers = {
            "Content-Type": "application/json",
            "Authorization": req.headers.token
        }
        axios.get(usersUrl, { headers: headers }).then(resp => {
            var roles = resp.data.filter(role => {
                return role.name != 'uma_authorization' && role.name != 'offline_access'
            })
            res.status(201).json({ roles: roles });
        }).catch(error => {
            res.status(409).json({ errMsg: error.response.data.errorMessage });
        })
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/getToken', async (req, res, next) => {
    logger.info("Generating Token for emission user");
    let userName = req.body.username;
    let url = `${process.env.KONG_BASE_URL}`;
    axios.get(`${url}/${userName}`).then(user => {
        axios.post(`${url}/${userName}/jwt`, {}).then(data => {
            var token = jwt.sign({ "iss": `${data.data.key}` }, `${data.data.secret}`, { algorithm: 'HS256' });
            res.status(200).json({ token, errMsg: "User already exists" });
        }).catch(e => {
            res.status(403).json({ errMsg: "Something went wrong" });
        })
    }).catch(err => {
        axios.post(`${url}`, { username: userName }).then(response => {
            axios.post(`${url}/${userName}/jwt`, {}).then(data => {
                var token = jwt.sign({ "iss": `${data.data.key}` }, `${data.data.secret}`, { algorithm: 'HS256' });
                res.status(200).json({ token, msg: "User Created" });
            }).catch(e => {
                res.status(403).json({ errMsg: "Something went wrong" });
            }).catch(error => {
                res.status(403).json({ errMsg: "Something went wrong" });
            })
        })
    });

})



module.exports = router;