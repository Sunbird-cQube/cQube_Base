const router = require('express').Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    var schools = [];
    var clusterId = req.body.clusterId
    var baseUrl = req.body.baseUrl;
    var allSchoolDetails = await axios.get(`${baseUrl}/getSchoolData`);
    allSchoolDetails.data.forEach(school => {
        if (clusterId == school.ClusterId) {
            schools.push(school.SchoolId);
        }
    });
    uniqueSchools = schools.filter(function (item, pos) {
        return schools.indexOf(item) == pos;
    });
    var allSchools = await axios.get(`${baseUrl}/school_wise_data`);

    var schoolsDetails = [];
    uniqueSchools.forEach(ids => {
        allSchools.data.forEach(schools => {
            if (ids == schools.x_axis) {
                obj = {
                    x_axis: ids,
                    clusterId: clusterId,
                    x_value: schools.x_value,
                    y_value: schools.y_value,
                    z_value: schools.z_value
                }
                schoolsDetails.push(obj);
            }
        })

    });
    res.send(schoolsDetails);
});

module.exports = router;