const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var const_data = require('../../lib/config');
router.post('/', async function (req, res) {
    const_data['getParams']['Key'] = 'static/users.json';
    const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
        if (err) {
            console.log(err);
            res.send([]);
        } else if (!data) {
            console.log("Something went wrong or s3 file not found");
            res.send([]);
        } else {
            users = JSON.parse(data.Body.toString());
            const user = users.find(u => u.user_email === req.body.email);
            if (user) {
                //Password hashing
                const hashedPass = await bcrypt.hash(req.body.cnfpass, 10);
                user.password = hashedPass;

                //updation date
                user.updated_on = `${(new Date()).getFullYear()}-${("0" + ((new Date()).getMonth() + 1)).slice(-2)}-${("0" + ((new Date()).getDate())).slice(-2)} ${(new Date()).toLocaleTimeString('en-IN', { hour12: false })}`;

                //Updater
                var updater = req.body.updaterId;
                user.updated_by = JSON.parse(updater);

                var params = {
                    Bucket: const_data['getParams']['Bucket'],
                    Key: "static/users.json",
                    Body: JSON.stringify(users)
                };
                const_data['s3'].upload(params, function (err, data) {
                    if (err) {
                        console.log('ERROR MSG: ', err);
                    } else {
                        // console.log(users);
                        res.status(200).json({ msg: "Password changed successfully" });
                    }
                });
            }

        }
    });
});

module.exports = router;