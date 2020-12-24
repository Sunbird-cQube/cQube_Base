const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const s3File = require('../../lib/reads3File');

router.post('/metaData', auth.authController, async (req, res) => {
    try {
        var { level } = req.body;
        logger.info('---healthCard metadata api ---');
        let fileName = `healthCard/${level}/metaData.json`;
        var districtData = await s3File.readS3File(fileName);
        var districtIds = [];
        var districtNames = [];
        var districts = [];

        var blockIds = [];
        var blockNames = [];
        var blocks = [];

        var clusterIds = [];
        var clusterNames = [];
        var clusters = [];

        var schoolIds = [];
        var schoolNames = [];
        var schools = [];
        districtData.map(item => {
            if (level == 'district') {
                districtIds.push(String(item.district_id));
                districtNames.push(item.district_name);
                districts.push({ id: item.district_id, name: item.district_name });
            }

            if (level == 'block') {
                blockIds.push(String(item.block_id));
                blockNames.push(item.block_name);
                blocks.push({ id: item.block_id, name: item.block_name, districtId: item.district_id });
            }
            if (level == 'cluster') {
                clusterIds.push(String(item.cluster_id));
                clusterNames.push(item.cluster_name);
                clusters.push({ id: item.cluster_id, name: item.cluster_name, districtId: item.district_id, blockId: item.block_id });
            }
            if (level == 'school') {
                schoolIds.push(String(item.school_id));
                schoolNames.push(item.school_name);
                schools.push({ id: item.school_id, name: item.school_name, blockId: item.block_id });
            }
        })
        districtIds = districtIds.filter((value, index, self) => {
            if (value != null) {
                return self.indexOf(value) === index;
            }
        });
        districtNames = districtNames.filter((value, index, self) => {
            if (value != null) {
                return self.indexOf(value) === index;
            }
        });

        districts = districts.reduce((unique, o) => {
            if (o.name != null && o.id != null) {
                if (!unique.some(obj => obj.id === o.id && obj.name === o.name)) {
                    unique.push(o);
                }
            }
            return unique;
        }, []);

        blockIds = blockIds.filter((value, index, self) => {
            if (value != null) {
                return self.indexOf(value) === index;
            }
        });
        blockNames = blockNames.filter((value, index, self) => {
            if (value != null) {
                return self.indexOf(value) === index;
            }
        });

        blocks = blocks.reduce((unique, o) => {
            if (o.name != null && o.id != null) {
                if (!unique.some(obj => obj.id === o.id && obj.name === o.name)) {
                    unique.push(o);
                }
            }
            return unique;
        }, []);

        clusterIds = clusterIds.filter((value, index, self) => {
            if (value != null) {
                return self.indexOf(value) === index;
            }
        });
        clusterNames = clusterNames.filter((value, index, self) => {
            if (value != null) {
                return self.indexOf(value) === index;
            }
        });

        clusters = clusters.reduce((unique, o) => {
            if (o.name != null && o.id != null) {
                if (!unique.some(obj => obj.id === o.id && obj.name === o.name)) {
                    unique.push(o);
                }
            }
            return unique;
        }, []);


        schoolIds = schoolIds.filter((value, index, self) => {
            if (value != null) {
                return self.indexOf(value) === index;
            }
        });
        schoolNames = schoolNames.filter((value, index, self) => {
            if (value != null) {
                return self.indexOf(value) === index;
            }
        });

        schools = schools.reduce((unique, o) => {
            if (o.name != null && o.id != null) {
                if (!unique.some(obj => obj.id === o.id && obj.name === o.name)) {
                    unique.push(o);
                }
            }
            return unique;
        }, []);

        logger.info('--- healthCard metadata api response sent ---');
        res.status(200).send({ districtIds, districtNames, districts, blockIds, blockNames, blocks, clusterIds, clusterNames, clusters, schoolIds, schoolNames, schools });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router;