const express = require('express');
const router = express.Router();
fs = require('fs').promises;
const {Photo, validate} = require("../models/photos");
const url = "http://localhost:8888";
var multer = require('multer');
const { nextTick } = require('process');
var upload = multer();

router.use('/', express.static('albums'));

router.get('/', (req, res) => {
    res.send("photos");
})

router.put('/', upload.array("documents"),  async (req, res) => {
    try {
        const {album} = req.body; 

        let data = await req.files.map(async (file) => {
            let filePath = `albums/${album.toLowerCase()}/${file.originalname}`;
            await fs.writeFile(filePath, file.buffer, "binary");
            let photo = new Photo({
                name: file.originalname,
                path: `/${filePath}`,
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
        res.status(422).send("unprocessable");
    }
})

router.post("/list", (req, res) => {
    const photoList = {
        "message": "OK",
        "documents": [
            {
                "id": "fef20926dc1b6ec6dd8f17acaa7a5ad9",
                "album": "Nature",
                "name": "road-1072823_1280.jpg",
                "path": "/albums/Nature/road-1072823_1280.jpg",
                "raw": "http://localhost:8888/photos/nature/road-1072823_1280.jpg"
            },
            {
                "id": "f4d11f680804c766edbb1f83867b3f34",
                "album": "Food",
                "name": "food-1932466_1280.jpg",
                "path": "/albums/Food/food-1932466_1280.jpg",
                "raw": "http://localhost:8888/photos/food/food-1932466_1280.jpg"
            },
            {
                "id": "e0f684f32e8252e5d0296998deb11c3b",
                "album": "Travel",
                "name": "japan-2014618_1280.jpg",
                "path": "/albums/Travel/japan-2014618_1280.jpg",
                "raw": "http://localhost:8888/photos/travel/japan-2014618_1280.jpg"
            },
            {
                "id": "d1be8d58bd74ab9a5ce065b79a81f526",
                "album": "Nature",
                "name": "forest-3119826_1280.webp",
                "path": "/albums/Nature/forest-3119826_1280.webp",
                "raw": "http://localhost:8888/photos/nature/forest-3119826_1280.webp"
            },
            {
                "id": "d087db08da2a8cb391a6106c817c465f",
                "album": "Other",
                "name": "taxi-cab-381233_1280.jpg",
                "path": "/albums/Other/taxi-cab-381233_1280.jpg",
                "raw": "http://localhost:8888/photos/other/taxi-cab-381233_1280.jpg"
            }
        ],
        "count": 50,
        "skip": 0,
        "limit": 5
    }

    res.send(photoList);
})

module.exports = router;