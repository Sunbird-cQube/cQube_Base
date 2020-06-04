const router = require('express').Router();
const bcrypt = require('bcrypt');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var const_data = require('../../lib/config');

router.post('/', auth.authController, async function (req, res) {
    try {
        logger.info('---Create user api ---');

        const_data['getParams']['Key'] = 'static/users.json'
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ msg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ msg: "No such data found" });
            } else {
                users = JSON.parse(data.Body.toString());

                let sorted = users.sort((a, b) => (a.user_id > b.user_id) ? 1 : ((b.user_id > a.user_id) ? -1 : 0));
                let user = users.find(u => u.user_email === req.body.email);

                if (user) {
                    res.status(409).json({ msg: "User already exist" });
                } else {
                    let obj;
                    if (req.body['middlename'] == '' || !req.body['middlename']) {
                        req.body['middlename'] = null;
                    }

                    if (req.body['lastname'] == '' || !req.body['lastname']) {
                        req.body['lastname'] = null;
                    }

                    // var startDate = new Date(req.body.start_date).valueOf();
                    // var endDate = new Date(req.body.end_date).valueOf();
                    var createdOn = `${(new Date()).getFullYear()}-${("0" + ((new Date()).getMonth() + 1)).slice(-2)}-${("0" + ((new Date()).getDate())).slice(-2)} ${(new Date()).toLocaleTimeString('en-IN', { hour12: false })}`

                    // console.log(startDate,endDate , createdOn);

                    const hashedPassword = await bcrypt.hash(req.body.cnfpass, 10);

                    obj = {
                        user_id: sorted[sorted.length - 1].user_id + 1,
                        first_name: req.body.firstname,
                        middle_name: req.body.middlename,
                        last_name: req.body.lastname,
                        user_email: req.body.email,
                        gender: req.body.gender,
                        user_designation: req.body.Designation,
                        user_status: 1,
                        role_id: JSON.parse(req.body.roleid),
                        password: hashedPassword,
                        user_validity_start_date: req.body.start_date.toString() + " 00:00:00",
                        user_validity_end_date: req.body.end_date.toString() + " 23:59:59",
                        created_on: createdOn.toString(),
                        created_by: JSON.parse(req.body.createrId),
                        updated_on: createdOn.toString(),
                        updated_by: JSON.parse(req.body.createrId)

                    }
                    users.push(obj);

                    var params = {
                        Bucket: const_data['getParams']['Bucket'],
                        Key: "static/users.json",
                        Body: JSON.stringify(users)
                    };
                    const_data['s3'].upload(params, function (err, data) {
                        if (err) {
                            console.log('ERROR MSG: ', err);
                        } else {
                            res.status(200).json({ msg: "User Added" });
                        }
                    });

                    // const_data['s3'].deleteObject(params, function (err, data) {
                    //     if (err) console.log(err, err.stack);  // error
                    //     else console.log();                 // deleted
                    // });
                }

            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ msg: "Internal error. Please try again!!" });
    }
});

module.exports = router;