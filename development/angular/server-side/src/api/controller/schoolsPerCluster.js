const router = require('express').Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    var schools = [];
    var clusterId = req.body.clusterId;
    var clusterName = req.body.clusterName;
    var baseUrl = req.body.baseUrl;
    var token = req.headers.token;

    console.log(clusterName);

    // var allSchoolDetails = await axios.get(`${baseUrl}/getSchoolData`, { 'headers': { 'token': "Bearer" + token } });
    // allSchoolDetails.data.forEach(school => {
    //     if (clusterId == school.cluster_id) {
    //         schools.push(school.school_id);
    //     }
    // });
    // uniqueSchools = schools.filter(function (item, pos) {
    //     return schools.indexOf(item) == pos;
    // });
    var allSchools = await axios.get(`${baseUrl}/school_wise_data`, { 'headers': { 'token': "Bearer" + token } });

    var schoolsDetails = [];
    allSchools.data.forEach(schools => {
        if (clusterName === schools.crc_name) {
            console.log(schools);
            obj = {
                x_axis: schools.x_axis,
                clusterId: clusterName,
                schoolName: schools.school_name,
                x_value: schools.x_value,
                y_value: schools.y_value,
                z_value: schools.z_value
            }
            schoolsDetails.push(obj);
            console.log(obj);
        }
    });
    res.send(schoolsDetails);
});

module.exports = router;