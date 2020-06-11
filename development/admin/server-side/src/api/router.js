const router = require('express').Router();

const roleLogin = require('./controller/users/roleBasedLogin');
const addUser = require('./controller/users/addUser');

// user details routes
router.use('/roleBasedLogin', roleLogin);
router.use('/addUser', addUser);

module.exports = router;