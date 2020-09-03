
const Photo = require("../../../models/photos");


describe('models photos ', () => { 
    
    describe(' createFileName', () => {
        it('should return the original name if there is no duplicated', async () => {
            const name = "name";

            const result = await Photo.createFileName(name, 0);
            expect(result).toBe(name);
        })

        it('should return the name with the suffix of (duplicate count ) if there is duplicate', async () => {
            const name = "name.jpg";

            const result = await Photo.createFileName(name, 1);
            expect(result).toBe('name(1).jpg');
        })
    })
})