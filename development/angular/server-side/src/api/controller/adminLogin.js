const router = require('express').Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    var log = fs.readFileSync('./src/file/loginData.json');
    var auth = JSON.parse(log);
    if (req.body.email !== auth.email) {
        res.send({ notEmail: "User not found" });
    } else if (req.body.cnfpass !== auth.password) {
        res.send({ wrongPasswd: "Wrong password" });
    } else {
        jwt.sign(auth, 'secret', { expiresIn: '1h' }, (err, data) => {
            res.status(200).json({ msg: "Logged In", token: data });
        })
    }
})

module.exports = router;