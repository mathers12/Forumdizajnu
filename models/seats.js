var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var seatsSchema = new Schema({
	profile: {
		type : Schema.ObjectId,
		ref: 'profiles'
	},
	table: {
		type : Schema.ObjectId,
		ref: 'tables'
	},
	part: {
		type : Schema.ObjectId,
		ref: 'parts'
	},
	room: {
		type : Schema.ObjectId,
		ref: 'rooms'
	},
	full_name: String,
	below_18: Boolean,
	order: Number,
	state: {
			type : Schema.ObjectId,
			ref: 'states'
		},
	modified: { type: Date, default: Date.now }
},{});

mongoose.model('seats', seatsSchema);