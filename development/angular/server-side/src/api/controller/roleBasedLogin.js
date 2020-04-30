const router = require('express').Router();
const jwt = require('jsonwebtoken');
var const_data = require('../../api/lib/config');

router.post('/', function(req, res) {
    const_data['getParams']['Key'] = 'static/users.json'
    const_data['s3'].getObject(const_data['getParams'], async function(err, data) {
        if (err) {
            console.log(err);
            res.send([]);
        } else if (!data) {
            console.log("Something went wrong or s3 file not found");
            res.send([]);
        } else {
            users = JSON.parse(data.Body.toString());
            const user = users.find(u => u.user_email === req.body.email && u.password === req.body.cnfpass);
            if (user) {
                jwt.sign(user, 'secret', { expiresIn: '24h' }, (err, data) => {
                    res.status(200).json({ msg: "Logged In", token: data });
                })
            } else {
                res.send({ errMsg: "Username/ Password is wrong" });
            }
        }
    });
});

module.exports = router;