const router = require('express').Router();
const axios = require('axios');
const auth = require('../../middleware/check-auth');

router.post('/', auth.authController, async (req, res) => {
    var distId = req.body.data.id;
    var baseUrl = req.body.baseUrl;
    var token = req.headers.token;
    var month = req.body.data.month;
    var year = req.body.data.year;
    var allBlocks = await axios.post(`${baseUrl}/block_wise_data`, { month: month, year: year }, { 'headers': { 'token': "Bearer" + token } });

    var blcokDetails = [];
    allBlocks.data.forEach(blocks => {
        if (distId === blocks.district_id) {
            obj = {
                x_axis: blocks.x_axis,
                distId: blocks.district_id,
                distName: blocks.district_name,
                block_name: blocks.block_name,
                x_value: blocks.x_value,
                y_value: blocks.y_value,
                z_value: blocks.z_value,
                students_count: blocks.students_count,
                total_schools: blocks.total_schools
            }
            blcokDetails.push(obj);
        }
    })

    res.send(blcokDetails);
});

module.exports = router;