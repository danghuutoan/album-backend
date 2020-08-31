const request = require('supertest');
const {Photo} = require("../../models/photos");

let server;
let photos = [];
describe('/photos/list', () => {
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
            .attach("documents", "./albumSource/food/coffee-2608864_1280.jpg");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "OK");
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBeTruthy();
            expect(res.body.data[0]).toHaveProperty("album");
            expect(res.body.data[0]).toHaveProperty("name");
            expect(res.body.data[0]).toHaveProperty("path");
            // removing uploaded photo after uploading
            const photo =  await Photo.findOne({name: res.body.data[0].name, album: res.body.data[0].album});
            if(photo) await photo.remove();
        })

        it(" should return 400 if the request is invalid",  async () => {
            // try sending a request without album field
            const res = await request(server)
            .put('/photos')
            .attach("documents", "./albumSource/food/coffee-2608864_1280.jpg");

            expect(res.status).toBe(400);
        })
    })
})