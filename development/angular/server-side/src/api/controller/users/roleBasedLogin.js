const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var const_data = require('../../lib/config');

router.post('/', function (req, res) {
    const_data['getParams']['Key'] = 'static/users.json'
    const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
        if (err) {
            console.log(err);
            res.send([]);
        } else if (!data) {
            console.log("Something went wrong or s3 file not found");
            res.send([]);
        } else {
            
            users = JSON.parse(data.Body.toString());

            const user = users.find(u => u.user_email === req.body.email && u.password === req.body.cnfpass);
            console.log(users);
            if (user) {
                jwt.sign(user, 'secret', { expiresIn: '24h' }, (err, data) => {
                    res.status(200).json({ msg: "Logged In", token: data, role: user.role_id, user_id: user.user_id });
                })
            } else {
                const roleUser = users.find(u => u.user_email === req.body.email);
                if (roleUser) {
                    bcrypt.compare(req.body.cnfpass, roleUser.password, function (err, result) {
                        if (result == true) {
                            if (roleUser) {
                                jwt.sign(roleUser, 'secret', { expiresIn: '24h' }, (err, data) => {
                                    res.status(200).json({ msg: "Logged In", email: roleUser.user_email, token: data, role: roleUser.role_id, user_id: roleUser.user_id });
                                })
                            }
                        } else {
                            res.send({ errMsg: "Password is wrong" });
                        }
                    });
                } else {
                    res.send({ errMsg: "User not found" })
                }
            }
        }
    });
});

module.exports = router;