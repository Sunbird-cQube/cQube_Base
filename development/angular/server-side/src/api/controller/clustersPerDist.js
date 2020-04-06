const router = require('express').Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    var distId = req.body.distId;
    var baseUrl = req.body.baseUrl;
    var token = req.headers.token;


    var allcluster = await axios.get(`${baseUrl}/cluster_wise_data`, { 'headers': { 'token': "Bearer" + token } });

    var schoolsDetails = [];
    allcluster.data.forEach(clusters => {
        if (distId === clusters.district_id) {
            obj = {
                x_axis: clusters.x_axis,
                blockName: clusters.block_name,
                distName: clusters.district_name,
                crc_name: clusters.crc_name,
                x_value: clusters.x_value,
                y_value: clusters.y_value,
                z_value: clusters.z_value,
                students_count: clusters.students_count
            }
            schoolsDetails.push(obj);
        }
    });
    res.send(schoolsDetails);
});

module.exports = router;