var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var clientsSchema = new Schema({

    firstName: String,
    lastName: String,
    password: String,
    email: String,
    verifiedEmail: Boolean,
    date_of_birth: Date,
    gender: String,
    profile: [
        {
            type: Schema.ObjectId,
            ref: "profiles"
        }
    ],
    roles: Array
},{});

mongoose.model('clients', clientsSchema);
