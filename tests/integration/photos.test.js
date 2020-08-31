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
})