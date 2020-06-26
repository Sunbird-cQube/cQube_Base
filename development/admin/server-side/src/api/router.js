const router = require('express').Router();

const roleLogin = require('./controller/users/roleBasedLogin');
const addUser = require('./controller/users/addUser');
const changePasswd = require('./controller/users/changePassword');
const users = require('./controller/users/allUsers');

//logs
const logs = require('./controller/logs/logs');

// user details routes
router.use('/roleBasedLogin', roleLogin);
router.use('/addUser', addUser);
router.use('/changePassword', changePasswd);
router.use('/allUsers', users);

router.use('/logs', logs);

module.exports = router;