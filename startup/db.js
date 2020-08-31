const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = () => {
    const dbName = config.get('dbName');
    mongoose.connect(`${config.get('dbUrl')}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true, auth:{authSource:"admin"}, "user":process.env.DB_USER, "pass": process.env.DB_PASSWORD})
    .then(() => {
        // console.log(`connected to ${dbName}`)
        winston.info(`connected to ${dbName}`);
    })
    .catch(err => console.error("couldnot connect to MongoDB", err));
}
