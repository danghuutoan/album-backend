const request = require('supertest');

let server;

describe('/photos/list', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(() => {
        server.close();
    })

    describe('POST /photos/list', () => {
        it(' should return the list of the available photos', async () => {
            const res = await request(server).get('/health');
            expect(res.status).toBe(200);
        })
    })
})