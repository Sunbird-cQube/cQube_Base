const router = require('express').Router();

const roleLogin = require('./controller/users/roleBasedLogin');
const addUser = require('./controller/users/addUser');
const changePasswd = require('./controller/users/changePassword');

//logs
const nodeLog = require('./controller/logs/node-logs');

// user details routes
router.use('/roleBasedLogin', roleLogin);
router.use('/addUser', addUser);
router.use('/changePassword', changePasswd);

router.use('/nodeLog', nodeLog);

module.exports = router;