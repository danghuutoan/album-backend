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

delelePhoto = async (album, fileName) => {
    const photo = await Photo.findOneAndDelete({ album: album, name: fileName});
    return photo;
}

insertPhoto = async (album, name, path) => {
    let photo = new Photo({
        name: name,
        path: path,
        album: album
    });
    
    photo = await photo.save();
    return { 
        name: photo.name,
        path: photo.path,
        album: photo.album, 
        };
}

getPaginatedPhoto = async (skip, limit) => {
    let photos = await Photo.find().skip(skip).limit(limit).select({album:1, name: 1, path: 1});
    return photos;
}

getPhotoCount = async () => {
    return await Photo.find().countDocuments();
}

getDuplicateName = async (album, name) => {
    let parts = name.split('.')
    let pattern =  '^' + parts[0] + '\\(\\d+\\).' + parts[1];
    let count = await Photo.find()
    .or([{name: new RegExp(pattern), album: album}, {name: name, album, album}])
    .countDocuments();
    if (count > 0) {
        return `${parts[0]}(${count}).${parts[1]}`;          
    } else {
        return name;
    }
}
exports.Photo = Photo;
exports.validate = validatePhoto;
exports.delelePhoto = delelePhoto;
exports.insertPhoto = insertPhoto;
exports.getPaginatedPhoto = getPaginatedPhoto;
exports.getPhotoCount = getPhotoCount;
exports.getDuplicateName = getDuplicateName;