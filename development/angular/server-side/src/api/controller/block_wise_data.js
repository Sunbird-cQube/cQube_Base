const router = require('express').Router();
var const_data = require('../config/aws-config');

router.get('/', async (req, res) => {
    const_data['getParams']['Key'] = 'block-wise-percentage.json'
    const_data['s3'].getObject(const_data['getParams'], async function (err, data) {
        if (err) {
            console.log(err);
        } else {
            const JSONdata = JSON.parse(data.Body.toString());
            res.send(JSONdata);
        }
    });
});

module.exports = router;