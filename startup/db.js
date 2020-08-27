const mongoose = require('mongoose');
const config = require('config');
module.exports = () => {
    mongoose.connect(`${config.get('dbUrl')}/${config.get('dbName')}`, { useNewUrlParser: true, useUnifiedTopology: true, auth:{authSource:"admin"}, "user":process.env.DB_USER, "pass": process.env.DB_PASSWORD})
    .then(() => {console.log("connected to mongodb")})
    .catch(err => console.error("couldnot connect to MongoDB", err));
}
