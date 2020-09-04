const httpMocks = require("node-mocks-http");
const errorMw = require("../../../middleware/error");

describe('test error middleware ', () => { 
    beforeEach( () => {
        require("../../../startup/log")();
    })
    it('should return status 500',  () => {
        const request = httpMocks.createRequest({
            method: "GET",
            url: "/photos/list",
        });
        const response = httpMocks.createResponse();
        errorMw(new Error("an Error"), request, response, () => {});
        expect(response.statusCode).toBe(500);      
    })

    it('should return status correct error message',  () => {
        const request = httpMocks.createRequest({
            method: "GET",
            url: "/photos/list",
        });
        const response = httpMocks.createResponse();
        errorMw(new Error("an Error"), request, response, () => {});
        expect(response._getData()).toBe("Internal server error");
    })
})