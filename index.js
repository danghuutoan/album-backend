require('express-async-errors');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const config = require('config');
const error = require("./middleware/error");


const app = express();
app.use(bodyParser.json());



app.use(cors());
require("./startup/log")();
require("./startup/db")();
require("./startup/routes")(app);

app.use(error);


const port = process.env.PORT || 8888;
const server = app.listen(port);

module.exports = server;