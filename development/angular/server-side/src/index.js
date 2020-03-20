const express = require('express');
const app = express();
const cors = require('cors');
const env = require('dotenv');
env.config();

const port = process.env.PORT || 3001;
console.log(process.env.PORT);

app.use(cors());
const router = require('./api/router');
app.use('', router);

app.listen(port, () => {
    console.log("Server started at port: ", port);
})
