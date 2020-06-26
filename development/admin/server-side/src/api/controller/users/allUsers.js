const router = require('express').Router();
const bcrypt = require('bcrypt');
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
var cron = require('node-cron');

var const_data = require('../../lib/config');

router.post('/', auth.authController, async function (req, res) {
    try {
        logger.info('---users api ---');

        const_data['getParams']['Key'] = 'static/users.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let users = JSON.parse(data.Body.toString());
                logger.info('---users api response sent ---');
                res.status(200).json(users);

            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/getUser/:id', auth.authController, async function (req, res) {
    try {
        logger.info('---users api ---');
        const_data['getParams']['Key'] = 'static/users.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let users = JSON.parse(data.Body.toString());
                const user = users.find(u => u.user_id == req.params.id);
                logger.info('---users api response sent ---');
                res.status(200).json(user);

            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});


router.post('/changeStatus/:id', auth.authController, async function (req, res) {
    try {
        logger.info('---users api ---');
        const_data['getParams']['Key'] = 'static/users.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let users = JSON.parse(data.Body.toString());
                const user = users.find(u => u.user_id == req.params.id);
                if (user) {
                    //Changing status
                    if (user.user_status == 1) {
                        user.user_status = 0;
                    } else {
                        user.user_status = 1;
                    }

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
                            res.status(200).json({ msg: "Status changed successfully", status: user.user_status });
                        }
                    });
                } else {
                    res.status(404).json({ errMsg: "no User found" });
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/deleteUser/:id', auth.authController, async function (req, res) {
    try {
        logger.info('---users api ---');
        const_data['getParams']['Key'] = 'static/users.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let users = JSON.parse(data.Body.toString());
                const user = users.find(u => u.user_id == req.params.id);
                if (user) {
                    let someArray = users.filter(person => person.user_id != user.user_id && person.user_email != user.user_email);
                    users = someArray;

                    var params = {
                        Bucket: const_data['getParams']['Bucket'],
                        Key: "static/users.json",
                        Body: JSON.stringify(users)
                    };
                    const_data['s3'].upload(params, function (err, data) {
                        if (err) {
                            console.log('ERROR MSG: ', err);
                        } else {
                            res.status(200).json({ msg: "User deleted successfully" });
                        }
                    });
                } else {
                    res.status(404).json({ errMsg: "no User found" });
                }
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/editUser/:id', auth.authController, async function (req, res) {
    try {
        logger.info('---users api ---');
        const_data['getParams']['Key'] = 'static/users.json';
        const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
            if (err) {
                logger.error(err);
                res.status(500).json({ errMsg: "Something went wrong" });
            } else if (!data) {
                logger.error("No data found in s3 file");
                res.status(403).json({ errMsg: "No such data found" });
            } else {
                let users = JSON.parse(data.Body.toString());
                let user = users.find(u => u.user_id == req.params.id);
                console.log(user);
                if (user) {
                    var todaysDate = `${(new Date()).getFullYear()}-${("0" + ((new Date()).getMonth() + 1)).slice(-2)}-${("0" + ((new Date()).getDate())).slice(-2)} ${(new Date()).toLocaleTimeString('en-IN', { hour12: false })}`;
                    user.user_validity_start_date = req.body.data.start_date + " 00:00:00";
                    user.user_validity_end_date = req.body.data.end_date + " 23:59:59";
                    user.updated_by = parseInt(req.body.data.updaterId);
                    user.updated_on = todaysDate.toString();
                    user.first_name = req.body.data.firstname;
                    user.middle_name = req.body.data.middlename;
                    user.last_name = req.body.data.lastname;
                    user.user_designation = req.body.data.Designation;
                    user.role_id = req.body.data.roleid;
                    user.gender = req.body.data.gender;

                    var params = {
                        Bucket: const_data['getParams']['Bucket'],
                        Key: "static/users.json",
                        Body: JSON.stringify(users)
                    };
                    const_data['s3'].upload(params, function (err, result) {
                        if (err) {
                            console.log('ERROR MSG: ', err);
                        } else {
                            res.status(200).json({ msg: "User validity extended" });
                        }
                    });
                } else {
                    res.status(404).json({ errMsg: "User not found" });
                }

            }

        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

// created_by: 100010
// created_on: "2020-05-27"
// first_name: "admin"
// gender: "M"
// last_name: ""
// middle_name: ""
// password: "$2b$10$FKD4Qv80Xtv/Emt6GCN4wOmFozs4XDIsvsLzXjfZKkCIiMsmofU2C"
// role_id: 1
// updated_by: 100036
// updated_on: "2020-06-26 12:39:12"
// user_designation: ""
// user_email: "admin@cqube.com"
// user_id: 100010
// user_status: 0
// user_validity_end_date: "2020-12-31 23:59:59"
// user_validity_start_date: 
// cron.schedule('00 00 * * *', () => {
//     try {
//         logger.info('---users api ---');

//         const_data['getParams']['Key'] = 'static/users.json';
//         const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
//             if (err) {
//                 logger.error(err);
//                 res.status(500).json({ errMsg: "Something went wrong" });
//             } else if (!data) {
//                 logger.error("No data found in s3 file");
//                 res.status(403).json({ errMsg: "No such data found" });
//             } else {
//                 let users = JSON.parse(data.Body.toString());
//                 let user = users.find(u => u.user_email === req.body.data.email && u.user_id == req.params.id);
//                 if (user) {
//                     var todaysDate = `${(new Date()).getFullYear()}-${("0" + ((new Date()).getMonth() + 1)).slice(-2)}-${("0" + ((new Date()).getDate())).slice(-2)} ${(new Date()).toLocaleTimeString('en-IN', { hour12: false })}`;
//                     user.user_validity_start_date = req.body.data.start_date + " 00:00:00";
//                     user.user_validity_end_date = req.body.data.end_date + " 23:59:59";
//                     user.updated_by = parseInt(req.body.data.updaterId);
//                     user.updated_on = todaysDate.toString();

//                     var params = {
//                         Bucket: const_data['getParams']['Bucket'],
//                         Key: "static/users.json",
//                         Body: JSON.stringify(users)
//                     };
//                     const_data['s3'].upload(params, function (err, result) {
//                         if (err) {
//                             console.log('ERROR MSG: ', err);
//                         } else {
//                             res.status(200).json({ msg: "User validity extended" });
//                         }
//                     });
//                 } else {
//                     res.status(404).json({ errMsg: "User not found" });
//                 }

//             }

//         });
//     } catch (e) {
//         logger.error(`Error :: ${e}`);
//         res.status(500).json({ errMsg: "Internal error. Please try again!!" });
//     }
// });



module.exports = router;