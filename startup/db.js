const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://localhost/investax_album')
    .then(() => {console.log("connected to mongodb")})
    .catch(err => console.error("couldnot connect to MongoDB", err));
}
