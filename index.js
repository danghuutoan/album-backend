const express = require('express');



const app = express();
var cors = require('cors');

app.use(cors());

require("./startup/db")();
require("./startup/routes")(app);



const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})