// The Network model

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var networkSchema = new Schema({
    Id: ObjectId,
    Name: String,
    NielsenCode: String,
    ScarlettCode: String,
    IsTurnerNetwork: Boolean
});

module.exports = mongoose.model('network', networkSchema, 'network');
