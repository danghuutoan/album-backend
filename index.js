const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const config = require('config');

const app = express();
app.use(bodyParser.json());



app.use(cors());

require("./startup/db")();
require("./startup/routes")(app);



const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(config.get('name'));
    console.log(`listening on port ${port}`)
})