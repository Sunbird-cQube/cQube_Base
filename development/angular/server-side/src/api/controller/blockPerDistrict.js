const router = require('express').Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    var blcoks = [];
    var distId = req.body.distId
    var baseUrl = req.body.baseUrl;
    var allSchoolDetails = await axios.get(`${baseUrl}/getSchoolData`);
    allSchoolDetails.data.forEach(school => {
        if (distId == school.DistrictId_x) {
            blcoks.push(school.BlockId);
        }
    });
    uniqueBlocks = blcoks.filter(function (item, pos) {
        return blcoks.indexOf(item) == pos;
    });
    var allBlocks = await axios.get(`${baseUrl}/block_wise_data`);

    var blcokDetails = [];
    uniqueBlocks.forEach(ids => {
        allBlocks.data.forEach(blocks => {
            if (ids == blocks.x_axis) {
                obj = {
                    x_axis: ids,
                    distId: distId,
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