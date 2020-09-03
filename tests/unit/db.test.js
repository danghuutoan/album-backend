const db = require("../../startup/db");
const mongoose = require('mongoose');
const winston = require('winston');

describe('db startup ', () => { 
    it(' should throw an error if it is failed to connect to mongodb', async () => {
        mongoose.connect = jest.fn().mockRejectedValue(new Error('failed to connected to mongodb'));
        winston.error = jest.fn();
        
        await require("../../startup/db")();

        expect(winston.error).toHaveBeenCalledWith("couldnot connect to MongoDB", new Error('failed to connected to mongodb'));    
    })
})