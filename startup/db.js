const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = async () => {
    const dbName = config.get('dbName');
    await mongoose.connect(`${config.get('dbUrl')}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true, auth:{authSource:"admin"}, "user":process.env.DB_USER, "pass": process.env.DB_PASSWORD})
    .then(() => {
        winston.info(`connected to ${dbName}`);
    })
    .catch(err => winston.error("couldnot connect to MongoDB", err));
}
