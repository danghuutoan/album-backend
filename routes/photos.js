const express = require('express');
const router = express.Router();
fs = require('fs').promises;
const {Photo, validate} = require("../models/photos");
const url = "http://localhost:8888";
var multer = require('multer');
const { nextTick } = require('process');
const { message } = require('statuses');
var upload = multer();

router.use('/', express.static('albums'));

router.get('/', (req, res) => {
    res.send("photos");
})

router.put('/', upload.array("documents"),  async (req, res, next) => {
    try {
        const {album} = req.body; 

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
    try {
        const {body} = req;
        const count = await Photo.find().countDocuments();

        let photos = await Photo.find().skip(body.skip).limit(body.limit);
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
            skip: 0,
            limit: body.limit
        });
    } catch (error) {
        next(error);
    }
    
})

router.delete("/:album/:fileName", async (req,res, next) => {
    const {album, fileName} = req.params;
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

    const result = await albums.map(
        async (album) => {
            const deletedFiles = album.documents.split(",");
            await deletedFiles.map(async (file) => {
                try {
                    let photo = await Photo.findOne({ album: album.album, name: file});
                    if(photo.path) {
                        await fs.unlink(`.${photo.path}`);
                    }
                } catch (error) {
                    next(error);
                }
                
            })
            
            try {
                let photo = await Photo.deleteMany({album:album.album, name: {$in: deletedFiles}});
            } catch (error) {
                next(error);
            }
        })

    Promise.all(result).then(() => {res.send({message: "OK"})});
 
})

module.exports = router;