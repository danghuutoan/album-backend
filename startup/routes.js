const health = require("../routes/health");
const photos = require("../routes/photos");

module.exports = function (app) {
    app.use('/health', health);
    app.use('/photos', photos);
}