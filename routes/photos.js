const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const {delelePhoto, insertPhoto, getPaginatedPhoto, getPhotoCount, getDuplicateCount, createFileName} = require("../models/photos");
const config = require('config');
const url = config.get('host');
const multer = require('multer');
const upload = multer();
const async = require('async');
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

    
    let data = await req.files.map(async (file) => {
        // let namePart = file.originalname.split('.');
        const originalname = file.originalname;
        const duplicateCount = await getDuplicateCount(album, originalname);
        const fileName = await createFileName(originalname, duplicateCount);
        const filePath = `/albums/${album.toLowerCase()}/${fileName}`
        await fs.writeFile(`.${filePath}`, file.buffer, "binary");
        return {...await insertPhoto(album, fileName, `${filePath}`), raw: `${url}/photos/${album}/${file.originalname}`};
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

    
    const count = await getPhotoCount();

    let photos = await getPaginatedPhoto(skip, limit);
    
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

    const photo = await delelePhoto(album, fileName);

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

    for(album of albums) {
        albumName = album.album;
        files = album.documents.split(",");

        for(file of files){
                const photo = await delelePhoto(albumName, file);
                if (photo != null) {
                    await fs.unlink(`.${photo.path}`);
                }
                photoPromises.push(photo);        
        }
    }

    Promise.all(photoPromises).then((results) => {
        res.send({message: "OK"});
    }).catch(e => {
        next(e)
    });
})

module.exports = router;