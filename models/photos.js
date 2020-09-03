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

class PhotoClass {
    static deleleByName (album, fileName){    
        return this.findOneAndDelete({ album: album, name: fileName});
    }

    async insert() {        
        await this.save();
        return { 
            name: this.name,
            path: this.path,
            album: this.album.toLowerCase(), 
        };
    }

    static getPaginated(skip, limit) {
        return this.find().skip(skip).limit(limit).select({album:1, name: 1, path: 1});
    }

    getUrl(hostname) {
        return `${hostname}/photos/${this.album}/${this.name}`;
    }

    static getCount() {
        return Photo.find().countDocuments();
    }

    static getDuplicateCount (album, name) {
        let parts = name.split('.')
        let pattern =  '^' + parts[0] + '\\(\\d+\\).' + parts[1];
        return this.find()
        .or([{name: new RegExp(pattern), album: album}, {name: name, album, album}])
        .countDocuments();
    }

    static createFileName(originalname, duplicateCount) {
        const namePart = originalname.split('.');
        if (duplicateCount > 0) {
            return `${namePart[0]}(${duplicateCount}).${namePart[1]}`;          
        } else {
            return originalname;
        }
    } 
}

photoSchema.loadClass(PhotoClass);

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
