const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { logger } = require('../../lib/logger');
var const_data = require('../../lib/config');

router.post('/', function (req, res) {
    try {
        logger.info('---Login api ---');

        const_data['getParams']['Key'] = 'static/users.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                users = JSON.parse(data.Body.toString());
                const user = users.find(u => u.user_email === req.body.email && u.password === req.body.cnfpass);
                if (user) {
                    jwt.sign(user, 'secret', { expiresIn: '24h' }, (err, data) => {
                        res.status(200).json({ msg: "Logged In", token: data, role: user.role_id, user_id: user.user_id });
                    })
                } else {
                    const roleUser = users.find(u => u.user_email === req.body.email && u.user_status === 1);
                    if (roleUser) {
                        if (roleUser.user_validity_end_date > `${(new Date()).getFullYear()}-${("0" + ((new Date()).getMonth() + 1)).slice(-2)}-${("0" + ((new Date()).getDate())).slice(-2)}`) {
                            bcrypt.compare(req.body.cnfpass, roleUser.password, function (err, result) {
                                if (result == true) {
                                    if (roleUser) {
                                        jwt.sign(roleUser, 'secret', { expiresIn: '24h' }, (err, data) => {
                                            res.status(200).json({ msg: "Logged In", email: roleUser.user_email, token: data, role: roleUser.role_id, user_id: roleUser.user_id });
                                        })
                                    }
                                } else {
                                    res.status(401).json({ errMsg: "Password is wrong" });
                                }
                            });
                        } else {
                            res.status(403).json({ errMsg: "User validity exceeded" });
                        }
                    } else {
                        res.status(403).json({ errMsg: "User not found" });
                    }
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;