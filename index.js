const express = require('express');
const { response } = require('express');
const app = express();
var cors = require('cors');
app.use(cors());
// app.use('/photos', express.static('albums'));


require("./startup/db")();
require("./startup/routes")(app);



const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})