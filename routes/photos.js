const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const Photo = require("../models/photos");
const config = require('config');
const url = config.get('host');
const multer = require('multer');
const upload = multer();
const Joi = require("joi");
const winston = require("winston");

router.use('/', express.static('albums'));


router.put('/', upload.array("documents"),  async (req, res, next) => {
    const schema = Joi.object({
        album: Joi.string().required()
    })

    const {error} = schema.validate(req.body);

    if (error) return res.status(400).send('Invalid input.');

    const {album} = req.body; 

    
    let data = await req.files.map(async (file) => {
        const originalname = file.originalname;
        const duplicateCount = await Photo.getDuplicateCount(album, originalname);
        const fileName = await Photo.createFileName(originalname, duplicateCount);
        const filePath = `/albums/${album.toLowerCase()}/${fileName}`
        await fs.writeFile(`.${filePath}`, file.buffer, "binary");
        const photo = new Photo({album: album, name: fileName, path: `${filePath}`});
        
        const result = await photo.insert();

        return {...result, raw: photo.getUrl(url)};
    })
    
    Promise.all(data).then((results) => {
        res.send({
            "message": "OK",
            "data":  results
        });
    })
    
})

router.post("/list", async (req, res, next) => {
    const {skip, limit} = req.body;
    const schema = Joi.object({
        skip: Joi.number().required(),
        limit: Joi.number().required()
    })

    const {error} = schema.validate(req.body);

    if (error) return res.status(400).send('Invalid input.');

    
    const count = await Photo.getCount();

    let photos = await Photo.getPaginated(skip, limit);
    
    photos = await photos.map((photo) => {
        return {
            id: photo.id,
            album: photo.album,
            name: photo.name,
            path: photo.path,
            raw: `${url}/photos/${photo.album}/${photo.name}`};
    })
    
    res.send({
        message: "OK",
        documents: photos,
        count: count,
        skip: skip,
        limit: limit
    });
})

router.delete("/:album/:fileName", async (req,res, next) => {
    const {album, fileName} = req.params;
    const schema = Joi.object({
        album: Joi.string().required(),
        fileName: Joi.string().required()
    })

    const photo = await Photo.deleleByName(album, fileName);

    if (photo != null) {
        return res.send({message: "OK"});
    }
    else {
        return res.status(404).send({message: "Not Found"});
    }

})

router.delete("/", async (req, res, next) => {
    const albums = req.body;
    const schema = Joi.array().items(Joi.object({
        album: Joi.string().required(),
        documents: Joi.string().required()
    }))
   
    const {error} = schema.validate(albums);
    if (error) return res.status(400).send('Invalid input.');
    
    let photoPromises = [];
    let failedList = [];
    for(album of albums) {
        albumName = album.album;
        files = album.documents.split(",").map(function(item) {
            return item.trim();
        });

        for(file of files){
                const photo = await Photo.deleleByName(albumName, file);
                if (photo != null) {
                    await fs.unlink(`.${photo.path}`);
                } else {
                    failedList.push(file);
                }
                photoPromises.push(photo);        
        }
    }

    Promise.all(photoPromises)
    .then((results) => {
        if(results.includes(null, 0)) {
            res.status(404).send({message: "FAILED", failed: failedList});
        }
        else {
            res.send({message: "OK"});
        }
    })
})

module.exports = router;