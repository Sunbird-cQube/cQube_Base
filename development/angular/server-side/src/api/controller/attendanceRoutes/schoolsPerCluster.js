const router = require('express').Router();
const axios = require('axios');
const auth = require('../../middleware/check-auth');

router.post('/', auth.authController, async (req, res) => {
    var clusterId = req.body.data.id;
    var baseUrl = req.body.baseUrl;
    var token = req.headers.token;
    var month = req.body.data.month;
    var year = req.body.data.year;

    var allSchools = await axios.post(`${baseUrl}/school_wise_data`, { month: month, year: year }, { 'headers': { 'token': "Bearer" + token } });

    var schoolsDetails = [];
    allSchools.data.forEach(schools => {
        if (clusterId === schools.cluster_id) {
            obj = {
                x_axis: schools.x_axis,
                cluster: schools.cluster_name,
                distName: schools.district_name,
                blockName: schools.block_name,
                schoolName: schools.school_name,
                x_value: schools.x_value,
                y_value: schools.y_value,
                z_value: schools.z_value,
                students_count: schools.students_count,
            }
            schoolsDetails.push(obj);
        }
    });
    res.send(schoolsDetails);
});

module.exports = router;