const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const {Photo, validate} = require("../models/photos");
const url = "http://localhost:8888";
const multer = require('multer');
const upload = multer();

const Joi = require("joi");

router.use('/', express.static('albums'));

router.get('/', (req, res) => {
    res.send("photos");
})

router.put('/', upload.array("documents"),  async (req, res, next) => {
    const schema = Joi.object({
        album: Joi.string().required()
    })

    const {error} = schema.validate(req.body);

    if (error) return res.status(400).send('Invalid input.');

    const {album} = req.body; 

    try {
        let data = await req.files.map(async (file) => {
            let filePath = `/albums/${album.toLowerCase()}/${file.originalname}`;
            await fs.writeFile(`.${filePath}`, file.buffer, "binary");
            let photo = new Photo({
                name: file.originalname,
                path: filePath,
                album: album
            });
            
            photo = await photo.save();
            return { 
                name: photo.name,
                path: photo.path,
                album: photo.album, 
                raw: `${url}/photos/${album}/${file.originalname}`};
        })
        
        res.send({
            "message": "OK",
            "data":  await Promise.all(data)
        });

    } catch (error) {
        next(error);
    }
})

router.post("/list", async (req, res, next) => {
    const {skip, limit} = req.body;
    const schema = Joi.object({
        skip: Joi.number().required(),
        limit: Joi.number().required()
    })

    const {error} = schema.validate(req.body);

    if (error) return res.status(400).send('Invalid input.');

    try {
        const count = await Photo.find().countDocuments();

        let photos = await Photo.find().skip(skip).limit(limit);
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
    } catch (error) {
        next(error);
    }
    
})

router.delete("/:album/:fileName", async (req,res, next) => {
    const {album, fileName} = req.params;
    const schema = Joi.object({
        album: Joi.string().required(),
        fileName: Joi.string().required()
    })

    try {
        let photo = await Photo.findOneAndDelete({ album: album, name: fileName});
        if(photo) {
            await fs.unlink(`.${photo.path}`);
            res.send({message: "OK"});
        } else {
            res.status(404).send({message: "Not Found"});
        }

    } catch (error) {
        next(error);
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
    
    let photos = [];

    for(album of albums) {
        albumName = album.album;
        files = album.documents.split(",");

        for(file of files){
                const photo = Photo
                .findOneAndDelete({album: albumName, name: file}).select({path: 1})
                .then((value) => {
                    fs.unlink(`.${value.path}`);
                });
                photos.push(photo);
        }
    }

    Promise.all(photos).then((values) => {
        res.send({message: "OK"});
    }).catch(e => {
        next(e)
    });

})

module.exports = router;