var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var confirmationsSchema = new Schema({
    addressedTo: {
        type : Schema.ObjectId,
        ref: 'clients'
    },
    description: String,
    state: String,
    role: String,
    createdBy: {
        type: Schema.ObjectId,
        ref: 'clients'
    },
    modified: { type: Date, default: Date.now }
},{});

mongoose.model('confirmations', confirmationsSchema);