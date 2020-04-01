const router = require('express').Router();
const axios = require('axios');
const auth = require('../middleware/check-auth');

router.post('/', auth.authController, async (req, res) => {
    var blcoks = [];
    var distId = req.body.distId;
    var distName = req.body.distName
    var baseUrl = req.body.baseUrl;
    var token = req.headers.token;

    console.log(distName);

    var allSchoolDetails = await axios.get(`${baseUrl}/getSchoolData`, { 'headers': { 'token': "Bearer" + token } });
    allSchoolDetails.data.forEach(school => {
        if (distId == school.district_id) {
            blcoks.push(school.block_id);
        }
    });
    uniqueBlocks = blcoks.filter(function (item, pos) {
        return blcoks.indexOf(item) == pos;
    });
    var allBlocks = await axios.get(`${baseUrl}/block_wise_data`, { 'headers': { 'token': "Bearer" + token } });

    var blcokDetails = [];
    uniqueBlocks.forEach(ids => {
        allBlocks.data.forEach(blocks => {
            if (ids == blocks.x_axis) {
                obj = {
                    x_axis: ids,
                    distId: distId,
                    distName: distName,
                    block_name: blocks.block_name,
                    x_value: blocks.x_value,
                    y_value: blocks.y_value,
                    z_value: blocks.z_value
                }
                blcokDetails.push(obj);
            }
        })

    });
    res.send(blcokDetails);
});

module.exports = router;