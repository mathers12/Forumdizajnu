var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var addressSchema = new Schema({
	street: String,
	num: String,
	zip: String,
	city: String,
	state: String,
	country: String,
	modified: { type: Date, default: Date.now }
},{});

mongoose.model('address', addressSchema);