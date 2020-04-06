const router = require('express').Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    var schools = [];
    var clusterId = req.body.clusterId;
    var baseUrl = req.body.baseUrl;
    var token = req.headers.token;


    var allSchools = await axios.get(`${baseUrl}/school_wise_data`, { 'headers': { 'token': "Bearer" + token } });

    var schoolsDetails = [];
    allSchools.data.forEach(schools => {
        if (clusterId === schools.cluster_id) {
            obj = {
                x_axis: schools.x_axis,
                crc: schools.crc_name,
                distName: schools.district_name,
                blockName: schools.block_name,
                schoolName: schools.school_name,
                x_value: schools.x_value,
                y_value: schools.y_value,
                z_value: schools.z_value,
                students_count: schools.students_count
            }
            schoolsDetails.push(obj);
        }
    });
    res.send(schoolsDetails);
});

module.exports = router;