
const Photo = require("../../../models/photos");
const mongoose = require('mongoose');

describe('models photos ', () => { 
    beforeEach(async () => {
        const db = require("../../../startup/db");
        const log = require("../../../startup/log");
        await log();
        await db();
    });

    afterEach(async () => {

    })
    describe(' insert()', () => {
        it('should be able to insert a new photo', async () => {
            const name = "photo1";
            const album = "album1";
            const path = "path1";
            const photo = await new Photo({name: name, album: album, path: path});
            await photo.insert();
    
            const result = await Photo.findOne({name: name, album, path, path});
            expect(result).not.toBe(null);
            if( result != null) result.remove();
        })
    })
})