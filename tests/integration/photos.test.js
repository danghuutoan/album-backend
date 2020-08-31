const request = require('supertest');

let server;

describe('/photos/', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(() => {
        server.close();
    })

    describe('GET /', () => {
        it(' should return the status of the server', async () => {
            const res = await request(server).get('/health');
            expect(res.status).toBe(200);
        })
    })
})