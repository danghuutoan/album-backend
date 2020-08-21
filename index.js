const express = require('express');
const { response } = require('express');
const app = express();
const health = require("./routes/health");
const photos = require("./routes/photos");

app.use('/health', health);
app.use('/photos', photos);

const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})