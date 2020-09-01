const request = require('supertest');
const {Photo} = require("../../models/photos");
const fs = require('fs');

let server;
let photos = [];
describe('/photos', () => {
    beforeEach(async () => {
        server = require('../../index');
        for (let i = 0; i < 10; i++) {
            const photo = new Photo({name: `photo${i}`, album: `album${i}`, path: `path${i}`});
            await photo.save();
            photos.push(photo);
        }
    });
    afterEach(async () => {
        server.close();
        for (photo of photos) {
            await photo.remove();
        }
    })

    describe('POST /photos/list', () => {
        it(' should return the list of the available photos if the request is valid', async () => {
            const res = await request(server)
                        .post('/photos/list')
                        .send({
                            'skip': 0,
                            'limit': 5
                        })
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json');
            

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "OK");
            expect(Array.isArray(res.body.documents)).toBeTruthy();
            expect(res.body).toHaveProperty("count", 10);
            expect(res.body).toHaveProperty("skip", 0);
            expect(res.body).toHaveProperty("limit", 5);
            expect(res.body.documents[0]).toHaveProperty('id');
            expect(res.body.documents[0]).toHaveProperty('album');
            expect(res.body.documents[0]).toHaveProperty('name');
            expect(res.body.documents[0]).toHaveProperty('path');
            expect(res.body.documents.length).toBe(5);
        })


        it(' should return 400 if the request is invalid', async () => {
            const res = await request(server)
                        .post('/photos/list')
                        .send({
                            'skip': 0,
                        })
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json');
            

            expect(res.status).toBe(400);
        })
    })


    describe('PUT /photos', () => {
        it(" should return 200 if the request is valid",  async () => {
            const res = await request(server)
            .put('/photos')
            .field("album", 'food')
            .attach("documents", "./albumSource/food/ice-cream-cone-1274894_1280.jpg")
            .attach("documents", "./albumSource/food/coffee-2608864_1280.jpg");
   
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "OK");
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBeTruthy(); 
            
            for(const file of res.body.data) {
                expect(file).toHaveProperty("album");
                expect(file).toHaveProperty("name");
                expect(file).toHaveProperty("path");
                expect(fs.existsSync(`.${file.path}`, () => {})).toBeTruthy();
                fs.unlink(`.${file.path}`, ()=> {});
    
                // removing uploaded photo after uploading
                const photo =  await Photo.findOne({name: file.name, album: file.album});
                if(photo) await photo.remove();
            }
           
            // check if the file is available in the file system after uploading
           
        })

        // it(" should return 400 if the request is invalid",  async () => {
        //     // try sending a request without album field
        //     const res = await request(server)
        //     .put('/photos')
        //     .attach("documents", "./albumSource/food/coffee-2608864_1280.jpg");
        //     expect(res.status).toBe(400);
        // })
    })

    describe('DELETE /photos/:album/:name', () => {
        it(" should return 200 if the request is valid",  async () => {
            // upload a file
            const album = "food";
            const fileName = "ice-cream-cone-1274894_1280.jpg"
            const uploadRes = await request(server)
            .put('/photos')
            .field("album", album)
            .attach("documents", `./albumSource/${album}/${fileName}`);
            
            expect(uploadRes.status).toBe(200);

            const res = await request(server)
            .delete('/photos/food/ice-cream-cone-1274894_1280.jpg');

            expect(res.status).toBe(200);
            Promise.all([res]).then(async(res) => {
                const photo = await Photo.findOne({name: fileName, album: album});
                expect(photo).toBe(null);
            })
        })

        it(" should return 404 if the file is not found",  async () => {
            const res = await request(server)
            .delete('/photos/food/ice-cream-cone-1274894_12801.jpg');

            expect(res.status).toBe(404);
        })
    })

    describe('GET /photos/:album/:name', () => {
        it(" should return 200 if the request is valid", async () => {
            const album = "food";
            const fileName = "ice-cream-cone-1274894_1280.jpg"
            const uploadRes = await request(server)
            .put('/photos')
            .field("album", album)
            .attach("documents", `./albumSource/${album}/${fileName}`);
            
            expect(uploadRes.status).toBe(200);

            const res = await request(server)
            .get('/photos/food/ice-cream-cone-1274894_1280.jpg');
            
            expect(res.status).toBe(200);
            expect(Buffer.isBuffer(res.body)).toBeTruthy();
   
            expect(res.headers['content-type']).toMatch(/^image\/*/);

            Promise.all([res]).then(async(res) => {
                const photo = await Photo.findOne({name: fileName, album: album});
                photo.remove();
                fs.unlink(`.albums/${album}/${fileName}`, ()=> {});
            })
        })

        it(" should return 404 if the file is not available", async () => {
            const res = await request(server)
            .get('/photos/food/unavailable_file.jpg');
            
            expect(res.status).toBe(404); 
        })
    })

    describe('DELETE /photos', () => {
        it(" should return 200 if the request is valid", async () => {
            const files = ['ice-cream-cone-1274894_1280.jpg', 'coffee-2608864_1280.jpg'];
            const uploadRes = await request(server)
            .put('/photos')
            .field("album", 'food')
            .attach("documents", "./albumSource/food/ice-cream-cone-1274894_1280.jpg")
            .attach("documents", "./albumSource/food/coffee-2608864_1280.jpg");
   
            expect(uploadRes.status).toBe(200);

            const res = await request(server)
            .delete('/photos')
            .send([{
                "album": "food",
                "documents": "ice-cream-cone-1274894_1280.jpg, coffee-2608864_1280.jpg"
            }]);

            expect(res.status).toBe(200);

            Promise.all([res]).then(async(res) => {
                for(file of files) {
                    expect(await Photo.findOne({name: file})).toBe(null);
                }
            })
            
        })
    })
})