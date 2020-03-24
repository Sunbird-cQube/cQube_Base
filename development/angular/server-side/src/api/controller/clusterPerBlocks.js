const router = require('express').Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    var clusters = [];
    var blockId = req.body.blockId
    var allSchoolDetails = await axios.get('http://localhost:3000/getSchoolData');
    allSchoolDetails.data.forEach(school => {
        if (blockId == school.BlockId) {
            clusters.push(school.ClusterId);
        }
    });
    uniqueClusters = clusters.filter(function (item, pos) {
        return clusters.indexOf(item) == pos;
    });
    var allClusters = await axios.get('http://localhost:3000/cluster_wise_data');

    var clusterDetails = [];
    uniqueClusters.forEach(ids => {
        allClusters.data.forEach(clusters => {
            if (ids == clusters.x_axis) {
                obj = {
                    x_axis: ids,
                    blockId: blockId,
                    x_value: clusters.x_value,
                    y_value: clusters.y_value,
                    z_value: clusters.z_value
                }
                clusterDetails.push(obj);
            }
        })

    });
    res.send(clusterDetails);
});

module.exports = router;