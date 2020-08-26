const mongoose = require('mongoose');
const config = require('config');
module.exports = () => {
    mongoose.connect(config.get('dbUrl'), { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log("connected to mongodb")})
    .catch(err => console.error("couldnot connect to MongoDB", err));
}
