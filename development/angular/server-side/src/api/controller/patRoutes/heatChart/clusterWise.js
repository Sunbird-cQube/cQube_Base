const router = require('express').Router();
const { logger } = require('../../../lib/logger');
const auth = require('../../../middleware/check-auth');
const s3File = require('../../../lib/reads3File');

router.post('/clusterWise', async (req, res) => {
    console.log(req.body);
    try {
        logger.info('---PAT heat map block wise api ---');
        let { year, grade, subject, examDate, districtId, blockId } = req.body
        let fileName = `pat/heatChart/${year}/blocks/${blockId}.json`
        // var data = await s3File.readS3File(fileName);
        let data = [
            {
                academicYear: 2019,
                grade: 'grade3',
                subject: 'maths',
                examDate: '29-07-2019',
                districtId: '2407',
                districtName: 'Ahemadabad',
                blockId: '240712',
                blockName: 'AMC',
                clusterId: '24071201',
                clusterName: 'ABC',
                indicatorId: '1',
                indicators: 'પરિચિત, અપરિચિત પરિસ્થિતિનું વર્ણન અને વિશ્લેષણ કરી શકે છે.',
                marks: '3'
            },
            {
                academicYear: 2019,
                grade: 'grade3',
                subject: 'maths',
                examDate: '30-07-2019',
                districtId: '2407',
                districtName: 'Ahemadabad',
                blockId: '240712',
                blockName: 'AMC',
                clusterId: '24071201',
                clusterName: 'ABC',
                indicatorId: '2',
                indicators: 'પરિચિત શબ્દ શોધે.',
                marks: '2'
            },
            {
                academicYear: 2019,
                grade: 'grade3',
                subject: 'science',
                examDate: '29-07-2019',
                districtId: '2407',
                districtName: 'Ahemadabad',
                blockId: '240705',
                blockName: 'City',
                clusterId: '24070501',
                clusterName: 'DEF',
                indicatorId: '8',
                indicators: 'સંખ્યોઓની મૂળભૂત ક્રિયાઓનો ઉપયોગ  રોજીંદા જીવનમાં કરે છે.',
                marks: '5'
            },
            {
                academicYear: 2019,
                grade: 'grade3',
                subject: 'science',
                examDate: '30-07-2019',
                districtId: '2407',
                districtName: 'Ahemadabad',
                blockId: '240705',
                blockName: 'City',
                clusterId: '24070501',
                clusterName: 'DEF',
                indicatorId: '3',
                indicators: 'એકચલ સુરેખ સમીકરણ સંબંધી વ્યવહારૂ કોયડા ઉકેલે છે.',
                marks: '10'
            },
            {
                academicYear: 2019,
                grade: 'grade4',
                subject: 'maths',
                examDate: '29-07-2019',
                districtId: '2407',
                districtName: 'Ahemadabad',
                blockId: '240705',
                blockName: 'City',
                clusterId: '24070501',
                clusterName: 'DEF',
                indicatorId: '1',
                indicators: 'જોયેલી ,સાંભળેલી કે વાંચેલી સામગ્રીમાંથી યોગ્ય તારણ કાઢી પ્રશ્નોના જવાબ લખી શકે છે .',
                marks: '6'
            },
            {
                academicYear: 2019,
                grade: 'grade4',
                subject: 'maths',
                examDate: '30-07-2019',
                districtId: '2407',
                districtName: 'Ahemadabad',
                blockId: '240705',
                blockName: 'City',
                clusterId: '24070501',
                clusterName: 'DEF',
                indicatorId: '2',
                indicators: 'આપેલા ચિત્રોનું વિગતવાર વર્ણન કરી શકે છે.',
                marks: '2'
            },
            {
                academicYear: 2019,
                grade: 'grade4',
                subject: 'science',
                examDate: '29-07-2019',
                districtId: '2407',
                districtName: 'Ahemadabad',
                blockId: '240705',
                blockName: 'City',
                clusterId: '24070501',
                clusterName: 'DEF',
                indicatorId: '8',
                indicators: 'શબ્દ-શબ્દ વચ્ચેના સંબંધ વિષે સભાનતા કેળવે અને વાંચેલી વિગતોને સમજી શકે છે.',
                marks: '5'
            },
            {
                academicYear: 2019,
                grade: 'grade4',
                subject: 'science',
                examDate: '30-07-2019',
                districtId: '2407',
                districtName: 'Ahemadabad',
                blockId: '240705',
                blockName: 'City',
                clusterId: '24070501',
                clusterName: 'DEF',
                indicatorId: '3',
                indicators: 'સીધી રેખાઓનો ઉપયોગ કરીને, ત્રુટક રેખા પરથી કાગળ કાપીને, કાગળને ગળી પાડીને... વગેરે દ્વારા દ્વિ-પરિમાણીય (2 D) આકારો બનાવે અને ઓળખે છે.',
                marks: '10'
            },

            {
                academicYear: 2019,
                grade: 'grade3',
                subject: 'maths',
                examDate: '29-07-2019',
                districtId: '2401',
                districtName: 'Kachchh',
                indicatorId: '1',
                indicators: 'પરિચિત, અપરિચિત પરિસ્થિતિનું વર્ણન અને વિશ્લેષણ કરી શકે છે.',
                marks: '3'
            },
            {
                academicYear: 2019,
                grade: 'grade3',
                subject: 'maths',
                examDate: '30-07-2019',
                districtId: '2401',
                districtName: 'Kachchh',
                indicatorId: '2',
                indicators: 'પરિચિત શબ્દ શોધે.',
                marks: '2'
            },
            {
                academicYear: 2019,
                grade: 'grade3',
                subject: 'science',
                examDate: '29-07-2019',
                districtId: '2401',
                districtName: 'Kachchh',
                indicatorId: '8',
                indicators: 'સંખ્યોઓની મૂળભૂત ક્રિયાઓનો ઉપયોગ  રોજીંદા જીવનમાં કરે છે.',
                marks: '5'
            },
            {
                academicYear: 2019,
                grade: 'grade4',
                subject: 'science',
                examDate: '30-07-2019',
                districtId: '2401',
                districtName: 'Kachchh',
                indicatorId: '3',
                indicators: 'સીધી રેખાઓનો ઉપયોગ કરીને, ત્રુટક રેખા પરથી કાગળ કાપીને, કાગળને ગળી પાડીને... વગેરે દ્વારા દ્વિ-પરિમાણીય (2 D) આકારો બનાવે અને ઓળખે છે.',
                marks: '10'
            }
        ]

        if(blockId) {
            data = data.filter(val => {
                return (
                    val.districtId == districtId &&
                    val.blockId == blockId
                )
            })
        }

        let clusterDetails = data.map(e => {
            return {
                districtId: e.districtId,
                districtName: e.districtName,
                blockId: e.blockId,
                blockName: e.blockName,
                clusterId: e.clusterId,
                clusterName: e.clusterName
            }
        })
        
        clusterDetails = clusterDetails.reduce((unique, o) => {
            if (!unique.some(obj => obj.clusterId === o.clusterId)) {
                unique.push(o);
            }
            return unique;
        }, []);        

        if (grade) {
            data = data.filter(val => {
                return val.grade == grade
            })
        }
        if (subject) {
            data = data.filter(val => {
                return val.subject == subject
            })
        }
        if (examDate) {
            data = data.filter(val => {
                return val.examDate == examDate
            })
        }

        logger.info('--- PAT heat map block wise response sent ---');
        res.status(200).send({ clusterDetails, data });
    } catch (e) {
        logger.error(`Error :: ${e}`)
        res.status(500).json({ errMessage: "Internal error. Please try again!!" });
    }
});

module.exports = router