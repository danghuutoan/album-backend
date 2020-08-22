const mongoose = require('mongoose');
const Joi = require("joi");

const photoSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    path: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    album: 
    { 
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    }
})

const Photo = mongoose.model('Photo', photoSchema);

function validatePhoto(photo) {
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        path: Joi.string().min(5).max(255).required(),
        album: Joi.string().min(1).max(50).required(),
    }
    
    return Joi.validate(photo, schema);
}

exports.Photo = Photo;
exports.validate = validatePhoto;