const router = require('express').Router();
const axios = require('axios');
const auth = require('../middleware/check-auth');

router.post('/', auth.authController, async (req, res) => {
    var distName = req.body.distName;
    var baseUrl = req.body.baseUrl;
    var token = req.headers.token;

    var allBlocks = await axios.get(`${baseUrl}/block_wise_data`, { 'headers': { 'token': "Bearer" + token } });

    var blcokDetails = [];
    allBlocks.data.forEach(blocks => {
        if (distName === blocks.district_name) {
            obj = {
                x_axis: blocks.x_axis,
                distName: distName,
                block_name: blocks.block_name,
                x_value: blocks.x_value,
                y_value: blocks.y_value,
                z_value: blocks.z_value
            }
            blcokDetails.push(obj);
        }
    })

    res.send(blcokDetails);
});

module.exports = router;